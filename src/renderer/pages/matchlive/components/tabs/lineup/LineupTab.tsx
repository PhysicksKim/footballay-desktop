import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import FootballFieldCanvas from './FootballFieldCanvas';
import { TeamLineups } from '@src/types/FixtureIpc';
import { debounce } from 'lodash';
import {
  HomeMarker,
  LineupTabContainer,
  TeamContainer,
  TeamLogoName,
} from './LineupStyled';
import LineupView from './LineupView';
import { ViewLineup } from '@src/types/FixtureIpc';

export interface LineupTabProps {
  applyEvents?: boolean;
}

const LineupTab: React.FC<LineupTabProps> = ({ applyEvents = true }) => {
  const lineup = useSelector(
    (state: RootState) => state.fixture.lineup,
  )?.lineup;
  const info = useSelector((state: RootState) => state.fixture.info);
  const events = useSelector((state: RootState) => state.fixture.events);
  const showPhoto = useSelector((state: RootState) => state.options.showPhoto);
  const processedLineup = useSelector(
    (state: RootState) => state.fixtureProcessedData.lineup,
  );

  const homeTeamContainerRef = useRef<HTMLDivElement>(null);
  const awayTeamContainerRef = useRef<HTMLDivElement>(null);
  const [homeGridPlayerHeight, setHomeGridPlayerHeight] = useState(0);
  const [awayGridPlayerHeight, setAwayGridPlayerHeight] = useState(0);
  const lineupRef = useRef<TeamLineups | null | undefined>(lineup);

  const [processedHomeLineup, setProcessedHomeLineup] =
    useState<ViewLineup | null>(null);
  const [processedAwayLineup, setProcessedAwayLineup] =
    useState<ViewLineup | null>(null);

  const updatePlayerSize = debounce(() => {
    const _lineup = lineupRef.current;
    if (!_lineup || !_lineup.away || !_lineup.home) {
      return;
    }
    const homeLineupGridCount = _lineup.home.formation.split('-').length + 1;
    const awayLineupGridCount = _lineup.away.formation.split('-').length + 1;

    if (homeTeamContainerRef.current) {
      const height =
        homeTeamContainerRef.current.clientHeight / homeLineupGridCount;
      setHomeGridPlayerHeight(height);
    }
    if (awayTeamContainerRef.current) {
      const height =
        awayTeamContainerRef.current.clientHeight / awayLineupGridCount;
      setAwayGridPlayerHeight(height);
    }
  }, 150);

  useEffect(() => {
    lineupRef.current = lineup;
  }, [lineup]);

  useEffect(() => {
    updatePlayerSize();
  }, [lineupRef.current]);

  useEffect(() => {
    window.addEventListener('resize', updatePlayerSize);
    return () => {
      window.removeEventListener('resize', updatePlayerSize);
    };
  }, []);

  useEffect(() => {
    setProcessedHomeLineup(processedLineup.home);
    setProcessedAwayLineup(processedLineup.away);
  }, [processedLineup]);

  const playerSize = Math.min(homeGridPlayerHeight, awayGridPlayerHeight);
  const minGridPlayerHeight = Math.min(
    homeGridPlayerHeight,
    awayGridPlayerHeight,
  );

  return (
    <LineupTabContainer>
      <TeamContainer ref={homeTeamContainerRef}>
        {processedHomeLineup && (
          <LineupView
            lineup={processedHomeLineup}
            isAway={false}
            playerSize={playerSize}
            lineHeight={minGridPlayerHeight}
            showPhoto={showPhoto}
          />
        )}
        {info && (
          <TeamLogoName className="team-name-logo-box team-name__home">
            <div className="team-logo">
              <img src={info.home.logo} alt={info.home.name} />
            </div>
            <div className="team-name">
              {info.home.koreanName || info.home.name}
            </div>
            <HomeMarker />
          </TeamLogoName>
        )}
      </TeamContainer>
      <TeamContainer ref={awayTeamContainerRef} $isAway>
        {processedAwayLineup && (
          <LineupView
            lineup={processedAwayLineup}
            isAway={true}
            playerSize={playerSize}
            lineHeight={minGridPlayerHeight}
            showPhoto={showPhoto}
          />
        )}
        {info && (
          <TeamLogoName className="team-name-logo-box team-name__away">
            <div className="team-logo">
              <img src={info.away.logo} alt={info.away.name} />
            </div>
            <div className="team-name">
              {info.away.koreanName || info.away.name}
            </div>
          </TeamLogoName>
        )}
      </TeamContainer>
      <FootballFieldCanvas />
    </LineupTabContainer>
  );
};

export default LineupTab;
