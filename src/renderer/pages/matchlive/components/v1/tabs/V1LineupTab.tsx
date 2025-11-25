import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/renderer/pages/matchlive/store/store';
import { PlayerStatistics } from '@src/renderer/pages/app/v1/types/api';
import { useV1LineupGrid } from './lineup/hooks/useV1LineupGrid';
import { V1ViewPlayer } from './lineup/types';
import V1LineupGrid from './lineup/V1LineupGrid';
import V1FieldCanvas from './lineup/V1FieldCanvas';
import V1Modal from '../common/V1Modal';
import {
  LineupTabContainer,
  TeamContainer,
  TeamLogoName,
  PlayerModalContentStyle,
  PlayerModalOverlayStyle,
  PlayerStatisticsContent,
} from './lineup/V1LineupStyled';
import RetryableImage from '../common/RetryableImage';
import { selectDisplayColor } from '@matchlive/utils/V1ColorUtils';

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
  const useAlternativeColorStrategy = useSelector(
    (state: RootState) => state.v1ColorOption.useAlternativeColorStrategy
  );
  const showPhoto = true;

  const getTeamLogo = (teamUid: string): string | undefined => {
    if (!info) return undefined;
    if (info.home.teamUid === teamUid) return info.home.logo;
    if (info.away.teamUid === teamUid) return info.away.logo;
    return undefined;
  };

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

      /**
       * 각 팀은 경기장 크기 절반만큼 차지합니다
       */
      const containerHeight = containerRef.current.clientHeight;
      const teamHeight = containerHeight / 2;

      const MIN_GRID_COUNT = 5;
      const homeRows = Math.max(MIN_GRID_COUNT, processedHome.players.length);
      const awayRows = Math.max(MIN_GRID_COUNT, processedAway.players.length);

      const hLineHeight = teamHeight / homeRows;
      const aLineHeight = teamHeight / awayRows;
      /**
       * 두 팀 중에서 라인 높이가 더 작은팀에 맞춥니다
       * 예를 들어 4줄(키퍼 + 4-3-3) 팀과 5줄(키퍼 + 4-2-3-1) 팀이 있을 때, 5줄 팀에 맞춥니다
       */
      const finalLineHeight = Math.min(hLineHeight, aLineHeight);

      setLineHeight(finalLineHeight);
      setPlayerSize(finalLineHeight);
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

  // Get display colors for teams
  const homeDisplayColor = selectDisplayColor(lineup?.lineup.home.playerColor, {
    useAlternativeStrategy: useAlternativeColorStrategy,
  });
  const awayDisplayColor = selectDisplayColor(lineup?.lineup.away.playerColor, {
    isAway: true,
    homeColor: homeDisplayColor || undefined,
    useAlternativeStrategy: useAlternativeColorStrategy,
  });

  if (!lineup || !processedHome || !processedAway) {
    return null;
  }

  return (
    <LineupTabContainer
      ref={containerRef}
      $isModalOpen={isModalOpen}
      $isActive={isActive}
    >
      <V1FieldCanvas />

      {/* Home Team */}
      <TeamContainer $isAway={false}>
        <TeamLogoName className="team-name__home" $color={homeDisplayColor}>
          {homeDisplayColor && <div className="color-bar" />}
          <div className="team-logo">
            {getTeamLogo(processedHome.teamUid) && (
              <RetryableImage
                src={getTeamLogo(processedHome.teamUid)!}
                alt={processedHome.teamName}
              />
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
        <TeamLogoName className="team-name__away" $color={awayDisplayColor}>
          {awayDisplayColor && <div className="color-bar" />}
          <div className="team-logo">
            {getTeamLogo(processedAway.teamUid) && (
              <RetryableImage
                src={getTeamLogo(processedAway.teamUid)!}
                alt={processedAway.teamName}
              />
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
