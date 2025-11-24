import React from 'react';
import { V1ViewLineup, V1ViewPlayer } from './types';
import { PlayerStatistics } from '@src/renderer/pages/app/v1/types/api';
import {
  GridLine,
  GridPlayer,
  SubInMark,
  CardYellow,
  CardRed,
  GoalMark,
  RatingBox,
  PlayerNumber,
  PlayerName,
} from './V1LineupStyled';
import RetryableImage from '../../../common/RetryableImage';

const getFinalPlayer = (player: V1ViewPlayer): V1ViewPlayer => {
  let currentPlayer = player;
  while (currentPlayer.subInPlayer) {
    currentPlayer = currentPlayer.subInPlayer;
  }
  return currentPlayer;
};

interface V1LineupGridProps {
  lineup: V1ViewLineup;
  isAway: boolean;
  playerSize: number;
  lineHeight: number;
  showPhoto: boolean;
  handlePlayerClick: (player: V1ViewPlayer) => void;
}

const V1LineupGrid: React.FC<V1LineupGridProps> = ({
  lineup,
  isAway,
  playerSize,
  lineHeight,
  showPhoto,
  handlePlayerClick,
}) => {
  return (
    <>
      {lineup.players.map((linePlayers, lineIndex) => (
        <GridLine
          key={`line-${lineIndex}`}
          $height={100 / lineup.players.length}
          $isAway={isAway}
          style={{
            // z-index ensures lower rows (closer to center) render above upper rows
            // This prevents rating boxes from being covered by player names in rows above
            zIndex: lineIndex,
          }}
        >
          {linePlayers.map((player, index) => {
            const leftPosition = isAway
              ? (100 / linePlayers.length) * (index + 0.5)
              : (100 / linePlayers.length) * (linePlayers.length - index - 0.5);

            const finalPlayer = getFinalPlayer(player);
            const photoExistAndShowPhoto = !!finalPlayer.photo && showPhoto;
            const photoSize = Math.max(lineHeight - 20, 0);
            const nameFontSize = 16;
            const isRenderable = photoSize > 0;

            return (
              isRenderable && (
                <GridPlayer
                  key={finalPlayer.matchPlayerUid}
                  $top={0}
                  $left={leftPosition}
                  $width={100 / linePlayers.length}
                  $playerSize={playerSize}
                  $lineHeight={lineHeight}
                  onClick={() => handlePlayerClick(finalPlayer)}
                >
                  <div className="player-number-photo-box">
                    {photoExistAndShowPhoto ? (
                      <RetryableImage
                        src={finalPlayer.photo!}
                        alt={finalPlayer.name}
                      />
                    ) : (
                      <PlayerNumber number={finalPlayer.number || 0} />
                    )}

                    {/* Events */}
                    {finalPlayer.events.subIn && (
                      <SubInMark
                        showPhoto={photoExistAndShowPhoto}
                        photoSize={photoSize}
                      />
                    )}
                    {finalPlayer.events.yellow && (
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
                    {finalPlayer.statistics?.rating && (
                      <RatingBox rating={finalPlayer.statistics.rating} />
                    )}
                  </div>

                  <PlayerName
                    name={finalPlayer.koreanName || finalPlayer.name}
                    fontSize={nameFontSize}
                  />
                </GridPlayer>
              )
            );
          })}
        </GridLine>
      ))}
    </>
  );
};

export default V1LineupGrid;
