import { PlayerStatistics } from '@src/renderer/pages/app/v1/types/api';
import React from 'react';
import styled from 'styled-components';
import getRatingColor from './V1RatingUtils';
import { faFutbolBall } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RetryableImage from '../../common/RetryableImage';

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
  return (
    <ProfileSectionContainer>
      <div className="photo">
        <RetryableImage src={photo} alt={`${name} Profile`} />
      </div>
      <div className="player-infos">
        <div className="player-name">{name}</div>
        <div className="player-name-korean">{koreanName ? koreanName : ''}</div>
        <div className="player-rating-box">
          <div className="rating-title">평점</div>
          <PlayerStatisticsRatingBox rating={rating} />
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

type PositionString = string | 'G' | 'D' | 'M' | 'F';

const PlayerStatisticsList = ({
  stats,
  position,
}: {
  stats: PlayerStatistics;
  position: PositionString;
}) => {
  const statisticsToDisplay = statisticsArray(stats, position);
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

const calculatePassesAccuracyPercentString = (
  total: number,
  success: number
) => {
  if (total === 0) {
    return '0%';
  }
  return `${((success / total) * 100).toFixed(1)}%`;
};

/**
 * V1 API PlayerStatistics has limited fields compared to legacy API.
 * Available fields: minutesPlayed, position, rating, captain, substitute,
 * shotsTotal, shotsOn, goals, assists, yellowCards, redCards
 *
 * Missing fields that legacy had: passesTotal, passesAccuracy, dribbles,
 * fouls, tackles, duels, interceptions, etc.
 *
 * These detailed stats may be available in TeamStatistics, but are not
 * provided at the individual player level in V1 API.
 */
const statisticsArray = (stats: PlayerStatistics, position: PositionString) => {
  return [
    { data: stats.shotsTotal || 0, name: '슈팅' },
    { data: stats.shotsOn || 0, name: '유효슈팅' },
    { data: stats.goals || 0, name: '골' },
    { data: stats.assists || 0, name: '어시스트' },
  ];
};

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
    background-color: #cddef5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #8ba4c5;
  }
`;

const CommonStatisticItem = styled.div`
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: end;
  transition: background-color 0.1s ease;

  box-sizing: border-box;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.5rem;

  border-bottom: 1px solid #dad8d8;

  user-select: none;
  -webkit-app-region: no-drag;

  line-height: 1.2rem;

  &:hover {
    background-color: #f5fbff;
    border-top: 3px solid #f1fcff;

    & > * {
      transition: transform 0s;
      transform: scale(1.2) translate(0, -5%);
      line-height: 1rem;
    }
  }
`;

const StatisticName = styled.div`
  font-weight: 500;
  color: #727272;
  font-size: 1rem;
  padding-top: 3px;
`;

const StatisticValue = styled.div`
  color: #181818;
  text-align: right;
  font-weight: 500;
  font-size: 1.2rem;
`;

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
    max-width: 50%;

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
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 5px;
      white-space: nowrap;
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

// Player Event Markers

const GoalFontAwesomeMark = faFutbolBall;

const GoalMarkTranslateDiv = styled.div<{ index: number }>`
  position: absolute;
  bottom: 0;
  font-size: 16px;
  border-radius: 16px;
  transform: translate(${(props) => props.index * 75}%, 50%);
  /* background-color: white; */
`;

const GoalMarkIcon: React.FC<{ index: number }> = ({ index }) => {
  return (
    <GoalMarkTranslateDiv index={index}>
      <FontAwesomeIcon
        style={{
          backgroundColor: 'white',
          borderRadius: '50%',
        }}
        icon={GoalFontAwesomeMark}
      />
    </GoalMarkTranslateDiv>
  );
};

const GoalMarkWrapper = styled.div`
  position: relative;
`;

const GoalMark: React.FC<{ goal: number }> = ({ goal }) => {
  let GoalMarks = [];
  for (let i = 0; i < goal; i++) {
    GoalMarks.push(<GoalMarkIcon index={i} key={'goal_' + i} />);
  }
  return <GoalMarkWrapper>{GoalMarks}</GoalMarkWrapper>;
};

const RatingBoxStyle = styled.div<{ $ratingColor: string }>`
  background-color: ${(props) => props.$ratingColor};
  border-radius: 10px;
  padding: 2px 5px;
  font-size: 14px;
  color: #ffffffeb;
  margin-left: 5px;
`;

const PlayerStatisticsRatingBox: React.FC<{ rating: string }> = ({
  rating,
}) => {
  const ratingColor = getRatingColor(rating);
  const floatRating = parseFloat(rating);
  if (!rating || typeof floatRating !== 'number') {
    return <RatingBoxStyle $ratingColor={ratingColor}></RatingBoxStyle>;
  }

  const formattedRating = floatRating.toFixed(1);
  return (
    <RatingBoxStyle $ratingColor={ratingColor}>
      {formattedRating}
    </RatingBoxStyle>
  );
};
