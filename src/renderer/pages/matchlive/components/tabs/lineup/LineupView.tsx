import React, { useRef, useState } from 'react';
import {
  CardRed,
  CardYellow,
  GoalMark,
  GridLine,
  GridPlayer,
  PlayerName,
  PlayerNumber,
  RatingBox,
  SubInMark,
} from './LineupStyled';
import UniformIcon from './UniformIcon';
import {
  PlayerStatisticsResponse,
  ViewLineup,
  ViewPlayer,
} from '@src/types/FixtureIpc';
import RetryableImage from '../../common/RetryableImage';
import Modal from '../../common/Modal';
import styled from 'styled-components';
import { GlobalBorderRadiusPx } from './consts';

const getFinalPlayer = (player: ViewPlayer): ViewPlayer => {
  let currentPlayer = player;
  while (currentPlayer.subInPlayer) {
    currentPlayer = currentPlayer.subInPlayer;
  }
  return currentPlayer;
};

export const PlayerModalOverlayStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 27, 44, 0.473);
  border-radius: ${GlobalBorderRadiusPx}px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  -webkit-app-region: no-drag;
  transition: opacity 0.1s ease-in-out;
  opacity: 0;
  cursor: pointer;

  &.modal-enter,
  &.modal-enter-active {
    opacity: 0;
  }

  &.modal-enter-done {
    opacity: 1;
  }

  &.modal-exit {
    opacity: 1;
  }

  &.modal-exit-active,
  &.modal-exit-done {
    opacity: 0;
  }
`;

export const PlayerModalContentStyle = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 70%;
  height: 70%;
  max-width: 400px;
  max-height: 550px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 999;
  -webkit-app-region: no-drag;
  transition: opacity 0.1s ease-in-out;
  opacity: 1;
  cursor: default;
  overflow: hidden;
`;

const LineupView: React.FC<{
  lineup: ViewLineup;
  isAway: boolean;
  playerSize: number;
  lineHeight: number;
  showPhoto: boolean;
  isModalOpen: boolean;
  closeModal: () => void;
  selectedPlayerStatistics: PlayerStatisticsResponse | null;
  handlePlayerClick: (finalPlayer: ViewPlayer) => void;
}> = ({
  lineup,
  isAway,
  playerSize,
  lineHeight,
  showPhoto,
  isModalOpen,
  closeModal,
  selectedPlayerStatistics,
  handlePlayerClick,
}) => {
  const color = isAway ? '#77b2e2' : '#daa88b';

  return (
    <>
      {lineup.players.map((linePlayers, lineIndex) => (
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

            return (
              <GridPlayer
                key={finalPlayer.id}
                $top={0}
                $left={leftPosition}
                $width={100 / linePlayers.length}
                $playerSize={playerSize}
                $lineHeight={lineHeight}
              >
                <div
                  className="player-number-photo-box"
                  onClick={() => handlePlayerClick(finalPlayer)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPhoto && finalPlayer.photo ? (
                    <RetryableImage
                      src={finalPlayer.photo}
                      alt={finalPlayer.name}
                    />
                  ) : (
                    <div className="player-number">
                      <UniformIcon color={color} />
                      <div className="player-number_val">
                        {finalPlayer.number}
                      </div>
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
                  {finalPlayer.statistics?.statistics.rating && (
                    <RatingBox
                      rating={finalPlayer.statistics.statistics.rating}
                    />
                  )}
                </div>
                <PlayerName name={finalPlayer.koreanName || finalPlayer.name} />
              </GridPlayer>
            );
          })}
        </GridLine>
      ))}
    </>
  );
};

export default LineupView;
