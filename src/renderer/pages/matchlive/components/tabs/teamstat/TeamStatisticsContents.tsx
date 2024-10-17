import React from 'react';
import { Team, TeamStatistics } from '@src/types/FixtureIpc';
import TeamStatItem from './TeamStatBar';
import styled from 'styled-components';

const TeamStatisticsItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 65%;
`;

const TeamStatisticsContentsStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

interface TeamStatisticsContentsProps {
  homeInfo: Team | undefined;
  awayInfo: Team | undefined;
  homeStatistics: TeamStatistics | undefined;
  awayStatistics: TeamStatistics | undefined;
}

const pushIfExist = (
  homeStat: number | undefined,
  awayStat: number | undefined,
  title: string,
  items: JSX.Element[],
  key: string,
) => {
  if (homeStat !== undefined && awayStat !== undefined) {
    items.push(
      <TeamStatisticsItem key={key}>
        <TeamStatItem title={title} homeStat={homeStat} awayStat={awayStat} />
      </TeamStatisticsItem>,
    );
  }
};

const TeamStatisticsContents: React.FC<TeamStatisticsContentsProps> = ({
  homeInfo,
  awayInfo,
  homeStatistics: homeStats,
  awayStatistics: awayStats,
}) => {
  const generateStatisticsItems = () => {
    const items: JSX.Element[] = [];

    // 통계 항목을 배열에 추가
    pushIfExist(
      homeStats?.ballPossession,
      awayStats?.ballPossession,
      '볼 점유율',
      items,
      'ball-possession',
    );
    pushIfExist(
      homeStats?.passesAccuracyPercentage,
      awayStats?.passesAccuracyPercentage,
      '패스 성공률',
      items,
      'passes',
    );
    pushIfExist(
      homeStats?.totalPasses,
      awayStats?.totalPasses,
      '패스 수',
      items,
      'passes',
    );
    pushIfExist(
      homeStats?.totalShots,
      awayStats?.totalShots,
      '슈팅 수',
      items,
      'shots',
    );
    // 다른 통계 항목들도 여기에 추가할 수 있음

    return items;
  };

  return (
    <TeamStatisticsContentsStyle>
      {generateStatisticsItems()}
    </TeamStatisticsContentsStyle>
  );
};

export default TeamStatisticsContents;
