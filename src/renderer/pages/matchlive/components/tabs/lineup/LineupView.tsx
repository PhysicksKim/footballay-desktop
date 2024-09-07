import React from 'react';
import {
  CardRed,
  CardYellow,
  GoalMark,
  GridLine,
  GridPlayer,
  SubInMark,
} from './LineupStyled';
import UniformIcon from './UniformIcon';
import { ViewLineup, ViewPlayer } from './LineupTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
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
                <SubInMark showPhoto={photoExistAndShowPhoto} />
              )}
              {finalPlayer.events.yellow && (
                <CardYellow showPhoto={photoExistAndShowPhoto} />
              )}
              {finalPlayer.events.red && (
                <CardRed showPhoto={photoExistAndShowPhoto} />
              )}
              {finalPlayer.events.goal.length > 0 && (
                <GoalMark
                  goal={finalPlayer.events.goal}
                  showPhoto={photoExistAndShowPhoto}
                />
              )}
            </div>
            <span style={{ position: 'relative', overflow: 'visible' }}>
              {finalPlayer.koreanName || finalPlayer.name}
            </span>
          </GridPlayer>
        );
      })}
    </GridLine>
  ));
};

export default LineupView;
