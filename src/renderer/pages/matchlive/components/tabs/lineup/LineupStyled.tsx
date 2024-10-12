import { faArrowUp, faFutbol, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';
import { Goal, PlayerStatisticsResponse } from '@src/types/FixtureIpc';
import React from 'react';
import { PlayerStatisticsList, ProfileSection } from './StatisticsStyled';
import getRatingColor from './RatingUtils';

const commonBoxShadow = css`
  box-shadow: 1px 0 5px 0 rgba(0, 0, 0, 0.308);
`;

const LineupTabContainer = styled.div<{ $isModalOpen: boolean }>`
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 5px;
  user-select: none;

  // Modal이 열렸을 때 모든 자식 요소의 drag 비활성화
  ${({ $isModalOpen }) =>
    $isModalOpen &&
    `
      & * {
        -webkit-app-region: no-drag !important;
      }
    `}
`;

const TeamContainer = styled.div<{ $isAway?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 50%;
  box-sizing: border-box;
  overflow: hidden;
  flex-direction: ${({ $isAway: isAway }) => {
    return isAway ? 'column-reverse' : 'column';
  }};
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: visible;
  -webkit-app-region: drag;
`;

const TeamName = styled.h2`
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
  position: absolute;
`;

const GridLine = styled.div<{ $height: number; $isAway?: boolean }>`
  position: relative;
  width: 100%;
  height: ${(props) => props.$height}%;
  display: flex;
  -webkit-app-region: drag;
`;

const textShadowColor = 'rgba(31, 18, 105, 0.863)';
const textShadowStyle = css`
  text-shadow:
    -1px 0px ${textShadowColor},
    0px 1px ${textShadowColor},
    1px 0px ${textShadowColor},
    0px -1px ${textShadowColor};
`;
const isTextShadow = true;

const GridPlayer = styled.div<{
  $top: number;
  $left: number;
  $width: number;
  $playerSize: number;
  $lineHeight: number;
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  top: 0%;
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
  height: ${(props) => props.$lineHeight}px;
  transform: translateX(-50%);
  -webkit-app-region: drag;

  // 자식들은 클릭이 가능하도록 no-drag 설정
  & > * {
    -webkit-app-region: no-drag;
  }

  .player-number-photo-box {
    top: 0;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    height: ${(props) => props.$lineHeight - 20}px;

    user-select: none;

    img {
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: top;
      /**
      이미지를 드래그할 때 브라우저의 기본 동작으로 인해
      이미지가 마우스 커서를 따라 이동하는 현상이 발생합니다.
      이러한 동작을 방지하기 위해 -webkit-user-drag: none; 속성을 적용하여
      사용자가 이미지를 드래그할 수 없도록 설정하였습니다.
       */
      -webkit-user-drag: none;
      ${commonBoxShadow}
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
      width: ${(props) => props.$playerSize * 1.2}px;
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
        font-size: ${(props) => props.$playerSize * 0.32}px;
      }
    }
  }

  span {
    display: inline-block;
    font-size: 16px;
    font-weight: 700;
    /* overflow-y: hidden; */
    white-space: nowrap;
    margin-top: 3px;
    color: white;
    ${() => isTextShadow && textShadowStyle}
  }
`;

const TeamLogoName = styled.div`
  position: absolute;
  left: 0;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 24px;
  background-color: #002e6b;
  border-radius: 5px;
  padding-left: 5px;
  padding-bottom: 2px;
  margin-left: 18px;
  margin-top: 12px;
  margin-bottom: 12px;
  padding-right: 5px;

  &.team-name__home {
    top: 8px;
  }
  &.team-name__away {
    bottom: 8px;
  }

  .team-logo {
    margin-top: 1px;
    height: 20px;
    width: 20px;

    img {
      height: 100%;
      object-fit: contain;
    }
  }

  .team-name {
    display: flex;
    flex-direction: column;
    justify-content: end;
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;
    overflow-x: visible;
    margin-left: 3px;
    transform: translate(0, 2px);
    border-radius: 5px;
    color: white;
    text-align: center;
    padding-right: 3px;
  }
`;

const SubInMarkWrapper = styled.div<{
  $showPhoto?: boolean;
  $photoSize?: number;
}>`
  position: absolute;
  top: 0px;
  left: ${({ $photoSize }) => ($photoSize ? `0` : '-20%')};
  transform: translate(-50%, 0);
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #5c5c5c;
  box-sizing: border-box;
`;

const SubIndicatorInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background-color: #0d5df1;
  color: #ffffff; /* 필요에 따라 색상을 조정 */
`;

const SubInMark: React.FC<{ showPhoto: boolean; photoSize?: number }> = ({
  showPhoto,
  photoSize,
}) => {
  return (
    <SubInMarkWrapper $showPhoto={showPhoto} $photoSize={photoSize}>
      <SubIndicatorInner>
        <FontAwesomeIcon icon={faArrowUp} />
      </SubIndicatorInner>
    </SubInMarkWrapper>
  );
};

const CardWrapper = styled.div<{ $showPhoto?: boolean; $photoSize?: number }>`
  position: absolute;
  top: 27%;
  left: ${({ $photoSize }) => ($photoSize ? 0 : '-30%')};
  transform: translate(-75%, 0);
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #5c5c5c;
  border-radius: 50%;
  background-color: white;
  ${commonBoxShadow}
`;

const CardInner = styled.div<{ color: string; $borderColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65%;
  width: 50%;
  background-color: ${({ color }) => color};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 25%;
`;

const CardYellow: React.FC<{ showPhoto: boolean; photoSize?: number }> = ({
  showPhoto,
  photoSize,
}) => {
  return (
    <CardWrapper $showPhoto={showPhoto} $photoSize={photoSize}>
      <CardInner color="#f1f10d" $borderColor="#969617" />
    </CardWrapper>
  );
};

const CardRed: React.FC<{ showPhoto: boolean; photoSize?: number }> = ({
  showPhoto,
  photoSize,
}) => {
  return (
    <CardWrapper $showPhoto={showPhoto} $photoSize={photoSize}>
      <CardInner color="#f14141" $borderColor="#6b1010" />
    </CardWrapper>
  );
};

const GoalMarkWrapper = styled.div<{
  $showPhoto?: boolean;
  $photoSize?: number;
}>`
  position: absolute;
  bottom: -2px;
  right: ${({ $photoSize }) => ($photoSize ? '0' : '0%')};
  transform: translate(-5%, 0);
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  box-sizing: border-box;
  border-radius: 40%;
`;

/**
 * index 는 index+1 번째 골을 나타냅니다. 예를 들어 index=1 은 2번째 골을 나타냅니다.  <br>
 * index 로 명명한 이유는 LineupPlayer 가 Goal 객체를 배열로 가지고 있기 때문에, Goal 배열의 index 를 바탕으로 멀티골을 표시하기 때문입니다.  <br>
 * index 만큼 이동한 위치에 겹쳐서 골을 나타냅니다. <br>
 * OwnGoal 의 경우 빨간색으로 나타냅니다. <br>
 */
const GoalIndicatorInner = styled.div<{ $index: number; $isOwnGoal: boolean }>`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  background-color: ${({ $isOwnGoal }) => ($isOwnGoal ? '#f1e1e1' : 'white')};
  border-radius: 50%;
  right: ${({ $index }) => `-${$index * 7}px`};
  scale: 1;
  ${commonBoxShadow}
`;

const GoalMark: React.FC<{
  goal: Goal[];
  showPhoto: boolean;
  photoSize?: number;
}> = ({ goal, showPhoto, photoSize }) => {
  return (
    <GoalMarkWrapper $showPhoto={showPhoto} $photoSize={photoSize}>
      {goal
        .map((goal, index) => {
          return (
            <GoalIndicatorInner
              key={`${index}_${goal.minute}`}
              $index={index}
              $isOwnGoal={goal.ownGoal}
            >
              <FontAwesomeIcon
                icon={faFutbol}
                style={{
                  scale: '1.15',
                  color: goal.ownGoal ? '#961d1d' : 'black',
                }}
              />
            </GoalIndicatorInner>
          );
        })
        .reverse()}
    </GoalMarkWrapper>
  );
};

const PlayerNumberWrapper = styled.div<{
  $number: number;
}>`
  position: absolute;
  bottom: 0%;
  left: 0%;
  transform: translate(-50%, 0);
  width: 24px;
  height: 19px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid #93939b;
  border-radius: 5px;
  background-color: white;
  ${commonBoxShadow}
`;

const PlayerNumberInner = styled.div<{ $number: number }>`
  text-align: center;
  font-size: 14px;
  width: 100%;
  height: 100%;
  padding-top: 2px;
  color: black;
  font-weight: 700;
`;

const PlayerNumber: React.FC<{ number: number }> = ({ number }) => {
  return (
    <PlayerNumberWrapper $number={number}>
      <PlayerNumberInner $number={number}>{number}</PlayerNumberInner>
    </PlayerNumberWrapper>
  );
};

const PlayerNameSpan = styled.span`
  position: relative;
  overflow: visible;
  transform: translate(0, -3px);
  background-color: #0a4192c1;
  padding: 0 2px;
  border-radius: 5px;
  font-size: 20px;
`;

const PlayerName: React.FC<{ name: string }> = ({ name }) => {
  return <PlayerNameSpan>{name}</PlayerNameSpan>;
};

const HomeMarkerInner = styled.div`
  font-size: 12px;
  text-align: center;
  font-weight: 900;
  border-radius: 5px;
  /* font-family: 'GmarketSansBold'; */
  transform: translate(0, 2px);
  padding-top: 3px;
  padding-left: 4px;
  padding-right: 4px;
  padding-bottom: 1px;
  box-sizing: border-box;
  background-color: #12089e;
  color: #eef2f7;
  border: 1px solid #c5dcff;
`;

const HomeMarkerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 3px;
`;

const HomeMarker: React.FC = () => {
  return (
    <HomeMarkerWrapper>
      <HomeMarkerInner>H</HomeMarkerInner>
    </HomeMarkerWrapper>
  );
};

const RatingBox: React.FC<{ rating: string }> = ({ rating }) => {
  const floatRating = parseFloat(rating);
  const formattedRating = floatRating.toFixed(1);
  const ratingColor = getRatingColor(floatRating);

  const outstandingPlayerMark =
    floatRating > 8.5 ? OutstandingPlayerMark : null;

  return (
    <RatingWrapper $ratingColor={ratingColor}>
      {formattedRating}
      {outstandingPlayerMark}
    </RatingWrapper>
  );
};

const OutstandingPlayerMark = (
  <FontAwesomeIcon
    icon={faStar}
    style={{
      color: '#ffffff',
      fontSize: '0.6rem',
      paddingLeft: '2px',
      transform: 'translate(1px, 0)',
    }}
  />
);

const RatingWrapper = styled.div<{ $ratingColor: string }>`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(35%, -12%);
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 1.9rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 1px 5px;
  border-radius: 0.5rem;
  box-sizing: border-box;
  background-color: ${({ $ratingColor }) => $ratingColor};
  ${commonBoxShadow}
`;

const PlayerStatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0 3px;
  margin-top: 2px;
  width: 100%;
  height: 100%;
`;

const StatisticsListSection = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  width: 100%;
`;

const PlayerStatisticsContent: React.FC<{
  stats: PlayerStatisticsResponse;
}> = ({ stats }) => {
  console.log(stats);
  return (
    <PlayerStatisticsContainer>
      {/* 프로필 영역 */}
      <ProfileSection
        name={stats.player.name}
        koreanName={stats.player.koreanName}
        photo={stats.player.photo}
        goals={stats.statistics.goals}
        assists={stats.statistics.assists}
        rating={stats.statistics.rating}
      />

      {/* PlayerStatisticsList가 표시될 영역 */}
      <StatisticsListSection>
        <PlayerStatisticsList stats={stats.statistics} />
      </StatisticsListSection>
    </PlayerStatisticsContainer>
  );
};

export {
  LineupTabContainer,
  TeamContainer,
  TeamName,
  GridLine,
  GridPlayer,
  TeamLogoName,
  SubInMark,
  CardYellow,
  CardRed,
  GoalMark,
  PlayerNumber,
  PlayerName,
  HomeMarker,
  RatingBox,
  PlayerStatisticsContent,
};
