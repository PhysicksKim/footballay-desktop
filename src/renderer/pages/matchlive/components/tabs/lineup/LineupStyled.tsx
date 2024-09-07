import { faArrowUp, faFutbol } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Goal } from './LineupTypes';

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
  padding-top: 12px;
  padding-bottom: 5px;
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
`;

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

  .player-number-photo-box {
    top: 0;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    height: ${(props) => props.$lineHeight - 20}px;

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

  // 선수 이름
  span {
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    overflow-y: hidden;
    white-space: nowrap;
    margin-top: 3px;
    color: white;
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
    height: 24px;
    margin-left: 10px;

    img {
      width: 100%;
      height: 100%;
      min-width: 30px;
      min-height: 30px;
      object-fit: contain;
    }
  }

  .team-name {
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;
    overflow-x: visible;
    margin-left: 3px;
    margin-top: 10px;
    color: beige;
  }
`;

const SubInMarkWrapper = styled.div<{ $showPhoto?: boolean }>`
  position: absolute;
  top: 5px;
  right: ${({ $showPhoto: showPhoto }) => (showPhoto ? '-31%' : '5%')};
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0d5df1;
  border-radius: 50%;
`;

const SubIndicatorInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #ffffff; /* 필요에 따라 색상을 조정 */
`;

const SubInMark: React.FC<{ showPhoto: boolean }> = ({ showPhoto }) => {
  return (
    <SubInMarkWrapper $showPhoto={showPhoto}>
      <SubIndicatorInner>
        <FontAwesomeIcon icon={faArrowUp} />
      </SubIndicatorInner>
    </SubInMarkWrapper>
  );
};

const CardYellowWrapper = styled.div<{ $showPhoto?: boolean }>`
  position: absolute;
  bottom: 5%;
  right: ${({ $showPhoto: showPhoto }) => (showPhoto ? '-22%' : '10%')};
  width: 14px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f10d;
  border: 1px solid #dfdc44;
  box-sizing: border-box;
  border-radius: 20%;
`;

const CardYellowInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #dfdc44; /* 필요에 따라 색상을 조정 */
`;

const CardYellow: React.FC<{ showPhoto: boolean }> = ({ showPhoto }) => {
  return (
    <CardYellowWrapper $showPhoto={showPhoto}>
      <CardYellowInner />
    </CardYellowWrapper>
  );
};

const CardRedWrapper = styled.div<{ $showPhoto?: boolean }>`
  position: absolute;
  bottom: 5%;
  right: ${({ $showPhoto: showPhoto }) => (showPhoto ? '-22%' : '10%')};
  width: 14px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f10d0d;
  border: 1px solid #df4444;
  box-sizing: border-box;
  border-radius: 20%;
`;

const CardRedInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #df4444; /* 필요에 따라 색상을 조정 */
`;

const CardRed: React.FC<{ showPhoto: boolean }> = ({ showPhoto }) => {
  return (
    <CardRedWrapper $showPhoto={showPhoto}>
      <CardRedInner />
    </CardRedWrapper>
  );
};

const GoalMarkWrapper = styled.div<{ $showPhoto?: boolean }>`
  position: absolute;
  bottom: 5%;
  left: ${({ $showPhoto: showPhoto }) => (showPhoto ? '-30%' : '3%')};
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #e8eaff; */
  color: black;
  box-sizing: border-box;
  border-radius: 40%;
`;

const GoalIndicatorInner = styled.div<{ $index: number; $isOwnGoal: boolean }>`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  // Own goal인 경우 background 빨간색으로 표시
  background-color: ${({ $isOwnGoal }) => ($isOwnGoal ? '#f1e1e1' : 'white')};
  border-radius: 50%;

  // index 만큼 좌측으로 5px씩 이동
  left: ${({ $index }) => `-${$index * 7}px`};
  scale: 1;
`;

// TODO : 골 표시 수정 필요. 멀티 골 표시 방식 및 own goal 표시 방식 수정 필요
const GoalMark: React.FC<{ goal: Goal[]; showPhoto: boolean }> = ({
  goal,
  showPhoto,
}) => {
  return (
    <GoalMarkWrapper $showPhoto={showPhoto}>
      {goal.map((goal, index) => {
        return (
          <GoalIndicatorInner $index={index} $isOwnGoal={goal.ownGoal}>
            <FontAwesomeIcon
              icon={faFutbol}
              style={{
                scale: '1.15',
                color: goal.ownGoal ? '#961d1d' : 'black',
              }}
            />
          </GoalIndicatorInner>
        );
      })}
    </GoalMarkWrapper>
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
};
