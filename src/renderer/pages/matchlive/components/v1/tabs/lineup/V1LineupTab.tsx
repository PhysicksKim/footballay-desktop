import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/renderer/pages/matchlive/store/store';
import { PlayerStatistics } from '@src/renderer/pages/app/v1/types/api';
import { useV1LineupGrid } from './hooks/useV1LineupGrid';
import { V1ViewPlayer } from './types';
import V1LineupGrid from './V1LineupGrid';
import V1FieldCanvas from './V1FieldCanvas';
import V1Modal from '../../common/V1Modal';
import {
  LineupTabContainer,
  TeamContainer,
  TeamLogoName,
  PlayerModalContentStyle,
  PlayerModalOverlayStyle,
  PlayerStatisticsContent,
} from './V1LineupStyled';
import RetryableImage from '../../common/RetryableImage';

interface V1LineupTabProps {
  isActive: boolean;
}

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const V1LineupTab = ({ isActive }: V1LineupTabProps) => {
  const lineup = useSelector((state: RootState) => state.v1Fixture.lineup);
  const info = useSelector((state: RootState) => state.v1Fixture.info);
  const eventsResponse = useSelector(
    (state: RootState) => state.v1Fixture.events
  );
  const statsResponse = useSelector(
    (state: RootState) => state.v1Fixture.statistics
  );
  const showPhoto = true;

  // Get team logos from info state by matching teamUid
  const getTeamLogo = (teamUid: string): string | undefined => {
    if (!info) return undefined;
    if (info.home.teamUid === teamUid) return info.home.logo;
    if (info.away.teamUid === teamUid) return info.away.logo;
    return undefined;
  };

  // Create stats map
  const statsMap = useMemo(() => {
    const map = new Map<string, PlayerStatistics>();
    if (statsResponse) {
      statsResponse.home.playerStatistics.forEach((p) =>
        map.set(p.player.matchPlayerUid, p.statistics)
      );
      statsResponse.away.playerStatistics.forEach((p) =>
        map.set(p.player.matchPlayerUid, p.statistics)
      );
    }
    return map;
  }, [statsResponse]);

  const events = eventsResponse?.events || [];

  const { processedHome, processedAway } = useV1LineupGrid(
    lineup?.lineup.home,
    lineup?.lineup.away,
    events,
    statsMap
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);
  const [playerSize, setPlayerSize] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !processedHome || !processedAway) return;

      const containerHeight = containerRef.current.clientHeight;
      // Each team container takes 50% height
      const teamHeight = containerHeight / 2;

      const MIN_GRID_COUNT = 5;
      const homeRows = Math.max(MIN_GRID_COUNT, processedHome.players.length);
      const awayRows = Math.max(MIN_GRID_COUNT, processedAway.players.length);

      const hLineHeight = teamHeight / homeRows;
      const aLineHeight = teamHeight / awayRows;

      // Use the smaller line height to keep consistency between teams if desired,
      // or just calculate player size based on minimum to ensure they fit.
      // Legacy logic: minGridPlayerHeight = Math.min(homeGridPlayerHeight, awayGridPlayerHeight)
      const minLineHeight = Math.min(hLineHeight, aLineHeight);

      setLineHeight(minLineHeight);
      setPlayerSize(minLineHeight);
    };

    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener('resize', debouncedResize);

    // Call once to set initial size
    handleResize();

    return () => window.removeEventListener('resize', debouncedResize);
  }, [processedHome, processedAway, isActive]);
  // Added isActive to trigger resize when tab becomes active

  // Modal Logic
  const [selectedPlayer, setSelectedPlayer] = useState<V1ViewPlayer | null>(
    null
  );

  const handlePlayerClick = (player: V1ViewPlayer) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  const isModalOpen = !!selectedPlayer;

  if (!lineup || !processedHome || !processedAway) {
    return null; // Or loading state
  }

  return (
    <LineupTabContainer
      ref={containerRef}
      $isModalOpen={isModalOpen}
      style={{ display: isActive ? 'flex' : 'none' }}
    >
      <V1FieldCanvas />

      {/* Home Team */}
      <TeamContainer $isAway={false}>
        <TeamLogoName className="team-name__home">
          <div className="team-logo">
            {getTeamLogo(processedHome.teamUid) && (
              <RetryableImage src={getTeamLogo(processedHome.teamUid)!} alt={processedHome.teamName} />
            )}
          </div>
          <div className="team-name">{processedHome.teamName}</div>
        </TeamLogoName>

        <V1LineupGrid
          lineup={processedHome}
          isAway={false}
          playerSize={playerSize}
          lineHeight={lineHeight}
          showPhoto={showPhoto}
          handlePlayerClick={handlePlayerClick}
        />
      </TeamContainer>

      {/* Away Team */}
      <TeamContainer $isAway={true}>
        <TeamLogoName className="team-name__away">
           <div className="team-logo">
             {getTeamLogo(processedAway.teamUid) && (
               <RetryableImage src={getTeamLogo(processedAway.teamUid)!} alt={processedAway.teamName} />
             )}
           </div>
           <div className="team-name">{processedAway.teamName}</div>
        </TeamLogoName>

        <V1LineupGrid
          lineup={processedAway}
          isAway={true}
          playerSize={playerSize}
          lineHeight={lineHeight}
          showPhoto={showPhoto}
          handlePlayerClick={handlePlayerClick}
        />
      </TeamContainer>

      <V1Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        $StyledOverlay={PlayerModalOverlayStyle}
        $StyledContent={PlayerModalContentStyle}
      >
        {selectedPlayer && <PlayerStatisticsContent player={selectedPlayer} />}
      </V1Modal>
    </LineupTabContainer>
  );
};

export default V1LineupTab;
