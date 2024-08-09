import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../store/store';
import { is } from 'date-fns/locale';
import UniformIcon from './UniformIcon';
import FootballFieldCanvas from './FootballFieldCanvas';

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

const GridPlayer = styled.div<{ top: number; left: number; width: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  width: ${(props) => props.width}%;
  height: 100%;
  transform: translateX(-50%);

  .player-number-photo-box {
    height: calc(100% - 20px);
    width: 40px;
    bottom: 0;

    // uniform 이 이름 바로 위에 위치하도록 하기 위해서 설정
    display: flex;
    flex-direction: column-reverse;

    .player-number {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      border-radius: 50%;
      bottom: 0;

      .player-number_val {
        position: absolute;
        text-align: center;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
        padding-top: 6px;
      }
    }

    img {
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: top;
    }
  }
  span {
    font-size: 16px;
    /* color: white; */
    /* white-space: nowrap; */
  }
`;

export interface LineupTabProps {
  showPhoto?: boolean;
}

const LineupTab: React.FC<LineupTabProps> = ({ showPhoto = true }) => {
  const lineup = useSelector(
    (state: RootState) => state.fixture.lineup,
  )?.lineup;

  // 플레이어를 라인별로 정렬하는 함수
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

  // 팀의 최대 라인 수를 계산하는 함수
  const getMaxLine = (team: any) => {
    const lines = team.players.map((player: any) =>
      parseInt(player.grid.split(':')[0], 10),
    );
    return Math.max(...lines);
  };

  // 라인업을 구성하는 함수
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
                  key={player.id}
                  top={0}
                  left={position}
                  width={playerWidth}
                >
                  <div className="player-number-photo-box">
                    {showPhoto ? (
                      <img src={player.photo} alt={player.name} />
                    ) : (
                      <div className="player-number">
                        <UniformIcon color={color} />
                        <div className="player-number_val">{player.number}</div>
                      </div>
                    )}
                  </div>
                  <span>{player.name}</span>
                </GridPlayer>
              );
            })}
          </GridLine>,
        );
      }
    }
    return lines;
  };

  return (
    <LineupTabContainer>
      <TeamContainer>
        {/* <TeamName>{lineup?.home.teamName}</TeamName> */}
        {lineup && renderLineup(lineup.home)}
      </TeamContainer>
      <TeamContainer isAway>
        {/* <TeamName>{lineup?.away.teamName}</TeamName> */}
        {lineup && renderLineup(lineup.away, true)}
      </TeamContainer>
      <FootballFieldCanvas />
    </LineupTabContainer>
  );
};

export default LineupTab;
