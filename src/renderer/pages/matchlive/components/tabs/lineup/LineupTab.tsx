import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../store/store';
import { is } from 'date-fns/locale';
import UniformIcon from './UniformIcon';
import FootballFieldCanvas from './FootballFieldCanvas';
import {
  FixtureEvent,
  FixtureEventResponse,
  FixtureLineup,
  LineupTeam,
  Team,
  TeamLineups,
} from '@src/types/FixtureIpc';
import { debounce } from 'lodash';
import TeamLogo from '@src/renderer/pages/app/components/tabs/TeamLogo';
import {
  LineupTabContainer,
  TeamContainer,
  TeamName,
  GridLine,
  GridPlayer,
  TeamLogoName,
} from './LineupStyled';
import LineupView from './LineupView';
import { processLineupToView } from './LineupLogic';
import {
  ViewPlayer,
  ViewLineup,
  DisplayPlayer,
  DisplayLineup,
} from './LineupTypes';

export interface LineupTabProps {
  showPhoto?: boolean;
  applyEvents?: boolean;
}

/*
인천 : 2763
제주 : 2761
*/
const LineupTab: React.FC<LineupTabProps> = ({
  showPhoto = true,
  applyEvents = true,
}) => {
  const lineup = useSelector(
    (state: RootState) => state.fixture.lineup,
  )?.lineup;
  const info = useSelector((state: RootState) => state.fixture.info);
  const events = useSelector((state: RootState) => state.fixture.events);
  const homeTeamContainerRef = useRef<HTMLDivElement>(null);
  const awayTeamContainerRef = useRef<HTMLDivElement>(null);
  const [homeGridPlayerHeight, setHomeGridPlayerHeight] = useState(0);
  const [awayGridPlayerHeight, setAwayGridPlayerHeight] = useState(0);
  const lineupRef = useRef<TeamLineups | null | undefined>(lineup);

  useEffect(() => {
    lineupRef.current = lineup; // lineup 상태를 최신으로 유지하기 위해 ref를 사용
  }, [lineup]);

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
      console.log('home height', height);
      setHomeGridPlayerHeight(height);
    }
    if (awayTeamContainerRef.current) {
      const height =
        awayTeamContainerRef.current.clientHeight / awayLineupGridCount;
      console.log('away height', height);
      setAwayGridPlayerHeight(height);
    }
  }, 150);

  useEffect(() => {
    updatePlayerSize();
    window.addEventListener('resize', updatePlayerSize);

    return () => {
      window.removeEventListener('resize', updatePlayerSize);
    };
  }, [lineupRef]);

  useEffect(() => {
    if (lineup) {
      updatePlayerSize();
    }
  }, [lineup]);

  const processedHomeLineup = lineup
    ? processLineupToView(lineup.home, events?.events || [], applyEvents)
    : null;
  const processedAwayLineup = lineup
    ? processLineupToView(lineup.away, events?.events || [], applyEvents)
    : null;

  console.log('processedHomeLineup', processedHomeLineup);
  console.log('processedAwayLineup', processedAwayLineup);

  return (
    <LineupTabContainer>
      <FootballFieldCanvas />
      <TeamContainer ref={homeTeamContainerRef}>
        {processedHomeLineup && (
          <LineupView
            lineup={processedHomeLineup}
            isAway={false}
            playerSize={homeGridPlayerHeight}
            showPhoto={showPhoto}
          />
        )}
        {info && (
          <TeamLogoName className="team-name-logo-box">
            <div className="team-logo">
              <img src={info.home.logo} alt={info.home.name} />
            </div>
            <div className="team-name">
              {info.home.koreanName || info.home.name}
            </div>
          </TeamLogoName>
        )}
      </TeamContainer>
      <TeamContainer ref={awayTeamContainerRef} isAway>
        {processedAwayLineup && (
          <LineupView
            lineup={processedAwayLineup}
            isAway={true}
            playerSize={awayGridPlayerHeight}
            showPhoto={showPhoto}
          />
        )}
        {info && (
          <TeamLogoName className="team-name-logo-box">
            <div className="team-logo">
              <img src={info.away.logo} alt={info.away.name} />
            </div>
            <div className="team-name">
              {info.away.koreanName || info.away.name}
            </div>
          </TeamLogoName>
        )}
      </TeamContainer>
    </LineupTabContainer>
  );
};

export default LineupTab;
