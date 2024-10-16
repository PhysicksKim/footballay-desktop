import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../store/store';
import { GlobalBorderRadiusPx } from '../lineup/consts';
import TeamProfile from './TeamProfile';
import TeamStatisticsContents from './TeamStatisticsContents';

const TeamStatisticsTabContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transform: translate(0, 0);
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out;

  box-sizing: border-box;
  border-radius: ${GlobalBorderRadiusPx}px;
  border: 1px solid red;
`;

const TeamProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 1rem;
  width: 100%;

  & > * {
    width: 50%;
    box-sizing: border-box;
  }
`;

const TeamStatisticsTab = () => {
  const homeInfo = useSelector((state: RootState) => state.fixture.info?.home);
  const awayInfo = useSelector((state: RootState) => state.fixture.info?.away);
  const homeStatistics = useSelector(
    (state: RootState) => state.fixture.statistics?.home.teamStatistics,
  );
  const awayStatistics = useSelector(
    (state: RootState) => state.fixture.statistics?.away.teamStatistics,
  );

  return (
    <TeamStatisticsTabContainer>
      <TeamProfileContainer>
        <TeamProfile teamInfo={homeInfo} isHome={true} />
        <TeamProfile teamInfo={awayInfo} isHome={false} />
      </TeamProfileContainer>
      <TeamStatisticsContents
        homeInfo={homeInfo}
        awayInfo={awayInfo}
        homeStatistics={homeStatistics}
        awayStatistics={awayStatistics}
      />
    </TeamStatisticsTabContainer>
  );
};

export default TeamStatisticsTab;
