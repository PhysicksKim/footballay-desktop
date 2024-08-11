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

// Styled Components
const LineupTabContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  -webkit-app-region: drag;
  /* background-color: #000000f9; */
  /* background-color: red; */
  padding-top: 12px;
  padding-bottom: 5px;
`;

const TeamContainer = styled.div<{ isAway?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  overflow: hidden;
  flex-direction: ${({ isAway }) => {
    return isAway ? 'column-reverse' : 'column';
  }};
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: visible;
`;

const TeamName = styled.h2`
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
  position: absolute;
`;

const GridLine = styled.div<{ height: number; isAway?: boolean }>`
  position: relative;
  width: 100%;
  height: ${(props) => props.height}%;
  display: flex;
`;

const GridPlayer = styled.div<{
  top: number;
  left: number;
  width: number;
  playerSize: number;
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  top: 0%;
  left: ${(props) => props.left}%;
  width: ${(props) => props.width}%;
  height: ${(props) => props.playerSize}px;
  transform: translateX(-50%);

  .player-number-photo-box {
    top: 0;
    display: inline-block;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    height: ${(props) => props.playerSize - 30}px;

    img {
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: top;
    }

    .player-number {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      border-radius: 50%;
      bottom: 0;
      width: ${(props) => props.playerSize * 1.2}px;
      height: 100%;

      svg {
        height: 100%;
        width: 80%;
      }

      .player-number_val {
        position: absolute;
        box-sizing: border-box;
        text-align: center;
        bottom: 50%;
        left: 50%;
        transform: translate(-50%, 70%);
        font-size: ${(props) => props.playerSize * 0.32}px;
      }
    }
  }
  span {
    display: inline-block;
    font-size: 20px;
    overflow-y: hidden;
    /* color: white; */
    white-space: nowrap;
  }
`;

const TeamLogoName = styled.div`
  position: absolute;
  left: 0;
  width: 30%;
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;

  .team-logo {
    width: 30px;
    height: 30px;
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
      min-width: 30px;
      min-height: 30px;
      object-fit: contain;
    }
  }

  .team-name {
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    overflow-x: visible;
  }
`;

export interface LineupTabProps {
  showPhoto?: boolean;
}

const LineupTab: React.FC<LineupTabProps> = ({ showPhoto = true }) => {
  const lineup = useSelector(
    (state: RootState) => state.fixture.lineup,
  )?.lineup;
  const info = useSelector((state: RootState) => state.fixture.info);
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
    console.log('home grid player height: ', homeGridPlayerHeight);
    console.log('away grid player height: ', awayGridPlayerHeight);
  }, [homeGridPlayerHeight, awayGridPlayerHeight]);

  useEffect(() => {
    updatePlayerSize();
    window.addEventListener('resize', updatePlayerSize);
    return () => {
      window.removeEventListener('resize', updatePlayerSize);
    };
  }, []);

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
    color: string = '#1c91b4',
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
              const position = isAway
                ? (100 / playerCount) * (index + 0.5)
                : (100 / playerCount) * (playerCount - index - 0.5);
              return (
                <GridPlayer
                  className="grid-player"
                  key={player.id}
                  top={0}
                  left={position}
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
          {team.koreanName ? team.koreanName : team.name};
        </div>
      </TeamLogoName>
    );
  };

  return (
    <LineupTabContainer>
      <FootballFieldCanvas />
      <TeamContainer ref={homeTeamContainerRef}>
        {/* <TeamName>{lineup?.home.teamName}</TeamName> */}
        {lineup && renderLineup(lineup.home)}
        {info && teamLogoName(info.home)}
      </TeamContainer>
      <TeamContainer ref={awayTeamContainerRef} isAway>
        {/* <TeamName>{lineup?.away.teamName}</TeamName> */}
        {lineup && renderLineup(lineup.away, true)}
        {info && teamLogoName(info.away)}
      </TeamContainer>
    </LineupTabContainer>
  );
};

export default LineupTab;
