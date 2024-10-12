import { PlayerStatistics } from '@src/types/FixtureIpc';
import React from 'react';
import styled from 'styled-components';
import getRatingColor from './RatingUtils';
import { faFutbolBall } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SCROLLBAR_WIDTH = 7;

const PlayerStatisticsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 0;
  padding-left: ${SCROLLBAR_WIDTH}px;
  padding-right: ${SCROLLBAR_WIDTH}px;
  box-sizing: border-box;
  transform: translate(${SCROLLBAR_WIDTH / 2}px, 0);

  &::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b8b8b8;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const CommonStatisticItem = styled.div`
  width: 95%;
  display: flex;
  justify-content: space-between;
  transition: background-color 0.1s ease;

  box-sizing: border-box;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.5rem;

  border-bottom: 1px solid #dad8d8;

  &:hover {
    background-color: #fafeff;
    border-top: 3px solid #f1fcff;

    & > * {
      transform: scale(1.5);
      transition: transform 0.1s ease;
      line-height: normal;
    }
  }
`;

const StatisticName = styled.div`
  font-weight: 500;
  color: #6d6d6d;
  font-size: 1rem;
  padding-top: 3px;
`;

const StatisticValue = styled.div`
  color: #181818;
  text-align: right;
  font-weight: 500;
  font-size: 1.2rem;
`;

const calculatePassesAccuracyPercentString = (
  total: number,
  success: number,
) => {
  if (total === 0) {
    return '0%';
  }
  return `${((success / total) * 100).toFixed(1)}%`;
};

const statisticsArray = (stats: PlayerStatistics) => {
  const passesAccuracyPercent = calculatePassesAccuracyPercentString(
    stats.passesTotal,
    stats.passesAccuracy,
  );

  return [
    { data: stats.passesTotal, name: '패스 횟수' },
    { data: stats.passesAccuracy, name: '패스성공' },
    { data: passesAccuracyPercent, name: '패스성공률' },
    { data: stats.passesKey, name: '키패스' },
    { data: stats.shotsTotal, name: '슈팅' },
    { data: stats.shotsOn, name: '유효슈팅' },
    { data: stats.dribblesAttempts, name: '드리블 시도' },
    { data: stats.dribblesSuccess, name: '드리블 성공' },
    { data: stats.foulsCommitted, name: '파울' },
    { data: stats.foulsDrawn, name: '파울 유도' },
    { data: stats.interceptions, name: '인터셉트' },
    { data: stats.tacklesTotal, name: '태클' },
    { data: stats.duelsTotal, name: '볼경합 횟수' },
    { data: stats.duelsWon, name: '볼경합 승리' },
  ];
};

const ProfileSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;
  padding: 10px;
  border-bottom: 1px solid #ccc;

  .photo {
    flex-shrink: 0;
    width: 150px;
    height: 150px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
      box-sizing: border-box;
    }
  }

  .player-infos {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: 10px;
    flex-grow: 1;

    .player-name {
      font-size: 14px;
      font-weight: 500;
      color: #555;
      margin-bottom: 2px;
    }

    .player-name-korean {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .player-rating-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 5px;

      .rating-title {
        font-size: 14px;
        color: #555;
      }
    }

    .player-goal-assist-box {
      display: flex;
      flex-direction: column;
      margin-bottom: 5px;

      .player-stat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        margin-bottom: 5px;
        padding: 0;

        .stat-title {
          font-size: 14px;
          color: #555;
          margin-right: 10px;
          width: 50px;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 0;
          padding-right: 5px;
        }
      }
    }
  }
`;

const GoalFontAwesomeMark = faFutbolBall;
// const AssistFontAwesomeMark = faShoe

const GoalMarkTranslateDiv = styled.div<{ index: number }>`
  position: absolute;
  bottom: 0;
  font-size: 16px;
  border-radius: 50%;
  transform: translate(${(props) => props.index * 75}%, 50%);
  background-color: white;
  /* transform: translateX(0,{(props) => props.index * 50}); */
`;

const GoalMarkIcon: React.FC<{ index: number }> = ({ index }) => {
  return (
    <GoalMarkTranslateDiv index={index}>
      <FontAwesomeIcon icon={GoalFontAwesomeMark} />
    </GoalMarkTranslateDiv>
  );
};

const GoalMarkWrapper = styled.div`
  position: relative;
`;

const GoalMark: React.FC<{ goal: number }> = ({ goal }) => {
  let GoalMarks = [];
  for (let i = 0; i < goal; i++) {
    GoalMarks.push(<GoalMarkIcon index={i} />);
  }
  return <GoalMarkWrapper>{GoalMarks}</GoalMarkWrapper>;
};

const RatingBox: React.FC<{ ratingColor: string; rating: string }> = ({
  ratingColor,
  rating,
}) => <RatingBoxStyle ratingColor={ratingColor}>{rating}</RatingBoxStyle>;

const RatingBoxStyle = styled.div<{ ratingColor: string }>`
  background-color: ${(props) => props.ratingColor};
  border-radius: 10px;
  padding: 2px 5px;
  font-size: 14px;
  color: #ffffffeb;
  margin-left: 5px;
`;

interface ProfileSectionProps {
  name: string;
  koreanName: string | null;
  photo: string;
  goals: number;
  assists: number;
  rating: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  name,
  koreanName,
  photo,
  goals,
  assists,
  rating,
}) => {
  const ratingColor = getRatingColor(rating);
  return (
    <ProfileSectionContainer>
      <div className="photo">
        <img src={photo} alt={`${name} Profile`} />
      </div>
      <div className="player-infos">
        <div className="player-name">{name}</div>
        <div className="player-name-korean">{koreanName}</div>
        <div className="player-rating-box">
          <div className="rating-title">평점</div>
          <RatingBox ratingColor={ratingColor} rating={rating} />
        </div>
        <div className="player-goal-assist-box">
          <div className="player-stat stat-goals">
            <div className="stat-title stat-title-goals">Goals</div>
            <div className="stat-value stat-value-goals">{goals}</div>
            <GoalMark goal={goals} />
          </div>
          <div className="player-stat stat-assists">
            <div className="stat-title stat-title-assists">Assists</div>
            <div className="stat-value stat-value-goals">{assists}</div>
          </div>
        </div>
      </div>
    </ProfileSectionContainer>
  );
};

const PlayerStatisticsList = ({ stats }: { stats: PlayerStatistics }) => {
  const statisticsToDisplay = statisticsArray(stats);
  return (
    <PlayerStatisticsListWrapper>
      {statisticsToDisplay.map((statItem, index) => (
        <CommonStatisticItem key={`${index}_${statItem.data}`}>
          <StatisticName>{statItem.name}</StatisticName>
          <StatisticValue>{statItem.data}</StatisticValue>
        </CommonStatisticItem>
      ))}
    </PlayerStatisticsListWrapper>
  );
};

export { PlayerStatisticsList, ProfileSection };
