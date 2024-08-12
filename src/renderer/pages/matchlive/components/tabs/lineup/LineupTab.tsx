import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../store/store';
import { is } from 'date-fns/locale';
import UniformIcon from './UniformIcon';
import FootballFieldCanvas from './FootballFieldCanvas';
import { FixtureLineup, Team, TeamLineups } from '@src/types/FixtureIpc';
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

export interface DisplayPlayer {
  id: number;
  name: string;
  number: number;
  position: string;
  grid: string | null;
  substitute: boolean;
  card?: string; // 예: Yellow Card, Red Card
  scored?: boolean; // 골 여부
}

export interface DisplayLineup {
  teamId: number;
  teamName: string;
  players: DisplayPlayer[];
  substitutes: DisplayPlayer[];
}

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
  const [homeGridPlayerHeight, setHomeGridPlayerHeight] = React.useState(0);
  const [awayGridPlayerHeight, setAwayGridPlayerHeight] = React.useState(0);
  const lineupRef = useRef<TeamLineups | null | undefined>(lineup);

  useEffect(() => {
    lineupRef.current = lineup;
  }, [lineup]);

  const updatePlayerSize = debounce(() => {
    console.log('updatePlayerSize');
    const _lineup = lineupRef.current;
    if (!_lineup || !_lineup.away || !_lineup.home) {
      console.log('lineup is not ready');
      console.log(lineup);
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
    updatePlayerSize();
    window.addEventListener('resize', updatePlayerSize);
    return () => {
      window.removeEventListener('resize', updatePlayerSize);
    };
  }, []);

  useEffect(() => {
    console.log('events changed : ', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    console.log('lineup changed : ', JSON.stringify(lineup));
  }, [lineup]);

  useEffect(() => {
    console.log('info changed : ', JSON.stringify(info));
  }, [info]);

  const getLinePlayers = (players: any[], line: number) => {
    return players
      .filter((player) => {
        const gridLine = parseInt(player.grid.split(':')[0], 10);
        return gridLine === line;
      })
      .sort((a, b) => {
        const gridA = parseInt(a.grid.split(':')[1], 10);
        const gridB = parseInt(b.grid.split(':')[1], 10);
        return gridA - gridB;
      });
  };

  const getMaxLine = (team: any) => {
    const lines = team.players.map((player: any) =>
      parseInt(player.grid.split(':')[0], 10),
    );
    return Math.max(...lines);
  };

  const renderLineup = (
    team: any,
    isAway: boolean = false,
    color: string = '#77b2e2',
  ) => {
    const maxLines = getMaxLine(team);
    const containerHeight = 100 / maxLines;

    const lines = [];
    for (let line = 1; line <= maxLines; line++) {
      const linePlayers = getLinePlayers(team.players, line);
      if (linePlayers.length > 0) {
        const playerCount = linePlayers.length;
        const playerWidth = 100 / playerCount;
        lines.push(
          <GridLine
            className="grid-line"
            key={`line-${line}`}
            height={containerHeight}
            isAway={isAway}
          >
            {linePlayers.map((player, index) => {
              const leftPosition = isAway
                ? (100 / playerCount) * (playerCount - index - 0.5)
                : (100 / playerCount) * (index + 0.5);
              // const leftPosition = (100 / playerCount) * (index + 0.5);
              return (
                <GridPlayer
                  className="grid-player"
                  key={player.id}
                  top={0}
                  left={leftPosition}
                  width={playerWidth}
                  playerSize={
                    isAway ? awayGridPlayerHeight : homeGridPlayerHeight
                  }
                >
                  <div className="player-number-photo-box">
                    {showPhoto && player.photo ? (
                      <img src={player.photo} alt={player.name} />
                    ) : (
                      <div className="player-number">
                        <UniformIcon color={color} />
                        <div className="player-number_val">{player.number}</div>
                      </div>
                    )}
                  </div>
                  <span>
                    {player.koreanName ? player.koreanName : player.name}
                  </span>
                </GridPlayer>
              );
            })}
          </GridLine>,
        );
      }
    }
    return lines;
  };

  /**
   * 이미지가 로드되지 않으면 요소를 숨김
   */
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.style.display = 'none';
  };

  const teamLogoName = (team: Team) => {
    return (
      <TeamLogoName className="team-name-logo-box">
        <div className="team-logo">
          <img src={team.logo} onError={handleImageError} />
        </div>
        <div className="team-name">
          {team.koreanName ? team.koreanName : team.name}
        </div>
      </TeamLogoName>
    );
  };

  useEffect(() => {
    console.log('info changed : ', info);
  }, [info]);

  return (
    <LineupTabContainer>
      <FootballFieldCanvas />
      <TeamContainer ref={homeTeamContainerRef}>
        {lineup && renderLineup(lineup.home)}
        {info && teamLogoName(info.home)}
      </TeamContainer>
      <TeamContainer ref={awayTeamContainerRef} isAway>
        {lineup && renderLineup(lineup.away, true)}
        {info && teamLogoName(info.away)}
      </TeamContainer>
    </LineupTabContainer>
  );
};

export default LineupTab;
