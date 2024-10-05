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
import { ViewLineup, ViewPlayer } from '@src/types/FixtureIpc';
import RetryableImage from '../../common/RetryableImage';
import Modal from '../../common/Modal';
import styled from 'styled-components';

const getFinalPlayer = (player: ViewPlayer): ViewPlayer => {
  let currentPlayer = player;
  while (currentPlayer.subInPlayer) {
    currentPlayer = currentPlayer.subInPlayer;
  }
  return currentPlayer;
};

const PlayerModalOverlayStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  -webkit-app-region: no-drag;
  cursor: pointer;
`;

const PlayerModalContentStyle = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 999;
  -webkit-app-region: no-drag;
  cursor: pointer;
`;

const LineupView: React.FC<{
  lineup: ViewLineup;
  isAway: boolean;
  playerSize: number;
  lineHeight: number;
  showPhoto: boolean;
}> = ({ lineup, isAway, playerSize, lineHeight, showPhoto }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPlayerStatistics, setSelectedPlayerStatistics] =
    useState<any>(null); // 선택된 선수의 통계 정보 관리
  const modalCloseTimoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayerClick = (finalPlayer: ViewPlayer) => {
    console.log('선수 클릭', finalPlayer);
    if (!finalPlayer?.statistics) {
      return;
    }

    setModalOpen(true);
    if (modalCloseTimoutRef.current) {
      clearTimeout(modalCloseTimoutRef.current);
    }
    setSelectedPlayerStatistics(finalPlayer.statistics);
  };

  const closeModal = () => {
    setModalOpen(false);
    modalCloseTimoutRef.current = setTimeout(() => {
      setSelectedPlayerStatistics(null);
    }, 500);
  };

  const color = isAway ? '#77b2e2' : '#daa88b';
  // showPhoto={!!finalPlayer.photo && showPhoto}

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        $StyledOverlay={PlayerModalOverlayStyle}
        $StyledContent={PlayerModalContentStyle}
      >
        {selectedPlayerStatistics ? (
          <div>
            <h3>선수 통계</h3>
            <p>평점: {selectedPlayerStatistics.rating}</p>
          </div>
        ) : (
          <p>통계 정보가 없습니다.</p>
        )}
      </Modal>

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
                  {finalPlayer.statistics?.rating && (
                    <RatingBox rating={finalPlayer.statistics.rating} />
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
