import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../store/store';
import { GlobalBorderRadiusPx } from '../lineup/consts';
import TeamProfile from './TeamProfile';
import TeamStatisticsContents from './TeamStatisticsContents';
import MatchStatisticsHeader from './MatchStatisticsHeader';
import { MatchStatsColor, ThemeColors } from '../../common/Colors';
import PassSuccessPieChart from './PassSuccessPieChart';

const TeamStatisticsTabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  user-select: none;
`;

const TeamStatisticsTabContainer = styled.div`
  position: relative;
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  opacity: 1;
  transform: translate(0, 0);
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out;

  box-sizing: border-box;
  border-radius: ${GlobalBorderRadiusPx}px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.6);

  overflow: hidden;

  background-color: ${ThemeColors.popWindow.background};
`;

const TeamProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 좌우 배치 */
  align-items: stretch;
  margin-bottom: 1rem;
  width: 100%;
`;

const TeamStatisticsTab = () => {
  const info = useSelector((state: RootState) => state.fixture.info);
  const liveStatus = useSelector(
    (state: RootState) => state.fixture.liveStatus,
  );
  const homeInfo = useSelector((state: RootState) => state.fixture.info?.home);
  const awayInfo = useSelector((state: RootState) => state.fixture.info?.away);
  const homeStatistics = useSelector(
    (state: RootState) => state.fixture.statistics?.home.teamStatistics,
  );
  const awayStatistics = useSelector(
    (state: RootState) => state.fixture.statistics?.away.teamStatistics,
  );

  const score = liveStatus?.liveStatus.score;

  return (
    <TeamStatisticsTabWrapper>
      <TeamStatisticsTabContainer>
        <TeamProfileContainer>
          {homeInfo?.id && <TeamProfile teamInfo={homeInfo} isHome={true} />}
          <MatchStatisticsHeader
            homeScore={score?.home ? score.home : 0}
            awayScore={score?.away ? score.away : 0}
            status={liveStatus?.liveStatus}
          />
          {awayInfo?.id && <TeamProfile teamInfo={awayInfo} isHome={false} />}
        </TeamProfileContainer>
        {homeStatistics?.passesAccuracyPercentage &&
        awayStatistics?.passesAccuracyPercentage ? (
          <PassSuccessPieChart
            homePassSuccess={homeStatistics.passesAccuracyPercentage}
            awayPassSuccess={awayStatistics.passesAccuracyPercentage}
          />
        ) : (
          <></>
        )}
        <TeamStatisticsContents
          homeInfo={homeInfo}
          awayInfo={awayInfo}
          homeStatistics={homeStatistics}
          awayStatistics={awayStatistics}
        />
      </TeamStatisticsTabContainer>
    </TeamStatisticsTabWrapper>
  );
};

export default TeamStatisticsTab;
