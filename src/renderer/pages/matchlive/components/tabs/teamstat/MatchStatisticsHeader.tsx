import { FixtureLiveStatus, LiveStatus } from '@src/types/FixtureIpc';
import React from 'react';
import styled from 'styled-components';
import { ShortStatusToKorean } from '../../common/StatusKorean';
import { MatchStatsColor, ThemeColors } from '../../common/Colors';

const MatchStatsHeaderStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 120px;
  margin: 3px 3px;

  /* flex: 0; */
`;

const MatchStatsHeaderScore = styled.div`
  font-size: 2rem;
  font-weight: 500;
`;

const MatchStatsHeaderStatus = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
`;

interface MatchStatisticsHeaderProps {
  homeScore: number;
  awayScore: number;
  status: LiveStatus | undefined;
}

const MatchStatisticsHeader: React.FC<MatchStatisticsHeaderProps> = ({
  homeScore,
  awayScore,
  status,
}) => {
  return (
    <MatchStatsHeaderStyle>
      <MatchStatsHeaderScore>
        {homeScore} - {awayScore}
      </MatchStatsHeaderScore>
      <MatchStatsHeaderStatus>
        {status?.shortStatus ? ShortStatusToKorean(status.shortStatus) : 'NS'}
      </MatchStatsHeaderStatus>
    </MatchStatsHeaderStyle>
  );
};

export default MatchStatisticsHeader;
