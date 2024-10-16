import React from 'react';
import { Team, TeamStatistics } from '@src/types/FixtureIpc';

interface TeamStatisticsContentsProps {
  homeInfo: Team | undefined;
  awayInfo: Team | undefined;
  homeStatistics: TeamStatistics | undefined;
  awayStatistics: TeamStatistics | undefined;
}

const TeamStatisticsContents: React.FC<TeamStatisticsContentsProps> = ({
  homeInfo,
  awayInfo,
  homeStatistics,
  awayStatistics,
}) => {
  console.log;
  return (
    <div>
      <div className="ball-posession">
        <div className="home-ball-posession">
          {homeStatistics?.ballPossession}
        </div>
        <div className="away-ball-posession">
          {awayStatistics?.ballPossession}
        </div>
      </div>
    </div>
  );
};

export default TeamStatisticsContents;
