import React from 'react';
import { Team, TeamStatistics } from '@src/types/FixtureIpc';
import TeamStatItem from './TeamStatBar';
import styled from 'styled-components';
import { SCROLLBAR_WIDTH, scrollbarStyle } from '../../common/ScrollbarStyle';

const TeamStatisticsItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;
`;

const TeamStatisticsContentsStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-x: visible;
  overflow-y: auto;
  padding-top: 30px;
  width: calc(100% - ${SCROLLBAR_WIDTH * 1}px);

  padding-left: ${SCROLLBAR_WIDTH}px;
  padding-top: 5px;
  padding-bottom: 20px;

  pointer-events: all;
  -webkit-app-region: no-drag;

  ${scrollbarStyle}
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
    pushIfExist(
      homeStats?.cornerKicks,
      awayStats?.cornerKicks,
      '코너킥',
      items,
      'corner-kicks',
    );
    pushIfExist(
      homeStats?.goalkeeperSaves,
      awayStats?.goalkeeperSaves,
      '선방',
      items,
      'saves',
    );
    pushIfExist(homeStats?.fouls, awayStats?.fouls, '파울', items, 'fouls');
    pushIfExist(
      homeStats?.offsides,
      awayStats?.offsides,
      '오프사이드',
      items,
      'offsides',
    );
    pushIfExist(
      homeStats?.yellowCards,
      awayStats?.yellowCards,
      '경고',
      items,
      'yellow-cards',
    );
    pushIfExist(
      homeStats?.redCards,
      awayStats?.redCards,
      '퇴장',
      items,
      'red-cards',
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
