import React from 'react';
import {
  CardRed,
  CardYellow,
  GoalMark,
  GridLine,
  GridPlayer,
  PlayerName,
  PlayerNumber,
  SubInMark,
} from './LineupStyled';
import UniformIcon from './UniformIcon';
import { ViewLineup, ViewPlayer } from '@src/types/FixtureIpc';
import RetryableImage from '../../common/RetryableImage';

const getFinalPlayer = (player: ViewPlayer): ViewPlayer => {
  let currentPlayer = player;
  while (currentPlayer.subInPlayer) {
    currentPlayer = currentPlayer.subInPlayer;
  }
  return currentPlayer;
};

const LineupView: React.FC<{
  lineup: ViewLineup;
  isAway: boolean;
  playerSize: number;
  lineHeight: number;
  showPhoto: boolean;
}> = ({ lineup, isAway, playerSize, lineHeight, showPhoto }) => {
  const color = isAway ? '#77b2e2' : '#daa88b';
  // showPhoto={!!finalPlayer.photo && showPhoto}

  return lineup.players.map((linePlayers, lineIndex) => (
    <GridLine
      key={`line-${lineIndex}`}
      $height={100 / lineup.players.length}
      $isAway={isAway}
    >
      {linePlayers.map((player, index) => {
        const leftPosition = isAway
          ? (100 / linePlayers.length) * (index + 0.5)
          : (100 / linePlayers.length) * (linePlayers.length - index - 0.5);

        // 최종적으로 표시할 선수를 결정 (재귀적으로 subInPlayer를 탐색)
        const finalPlayer = getFinalPlayer(player);
        const photoExistAndShowPhoto = !!finalPlayer.photo && showPhoto;
        const photoSize = lineHeight - 20;

        console.log('final player stats', finalPlayer.statistics);

        return (
          <GridPlayer
            key={finalPlayer.id}
            $top={0}
            $left={leftPosition}
            $width={100 / linePlayers.length}
            $playerSize={playerSize}
            $lineHeight={lineHeight}
          >
            <div className="player-number-photo-box">
              {showPhoto && finalPlayer.photo ? (
                <RetryableImage
                  src={finalPlayer.photo}
                  alt={finalPlayer.name}
                />
              ) : (
                <div className="player-number">
                  <UniformIcon color={color} />
                  <div className="player-number_val">{finalPlayer.number}</div>
                </div>
              )}
              {finalPlayer.events.subIn && (
                <SubInMark
                  showPhoto={photoExistAndShowPhoto}
                  photoSize={photoSize}
                />
              )}
              {finalPlayer.events.yellow && !finalPlayer.events.red && (
                <CardYellow
                  showPhoto={photoExistAndShowPhoto}
                  photoSize={photoSize}
                />
              )}
              {finalPlayer.events.red && (
                <CardRed
                  showPhoto={photoExistAndShowPhoto}
                  photoSize={photoSize}
                />
              )}
              {finalPlayer.events.goal.length > 0 && (
                <GoalMark
                  goal={finalPlayer.events.goal}
                  showPhoto={photoExistAndShowPhoto}
                  photoSize={photoSize}
                />
              )}
              {finalPlayer.number && (
                <PlayerNumber number={finalPlayer.number} />
              )}
              {finalPlayer.statistics && (
                <div className="player-statistics">
                  {finalPlayer.statistics.rating}
                </div>
              )}
            </div>
            <PlayerName name={finalPlayer.koreanName || finalPlayer.name} />
          </GridPlayer>
        );
      })}
    </GridLine>
  ));
};

export default LineupView;
