import { Team } from '@src/types/FixtureIpc';
import { stat } from 'fs';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import RetryableImage from '../../common/RetryableImage';
import { MatchStatsColor } from '../../common/Colors';

const TeamProfileStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TeamProfileHeader = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;

  padding-top: 15px;
  padding-bottom: 10px;

  .team-logo {
    width: 50px;
    height: 50px;
  }

  .team-korean-name {
    height: 1.3rem;
    box-sizing: border-box;
    margin-top: 5px;
    margin-bottom: 3px;
    font-size: 1.2rem;
    font-weight: 500;
  }

  .team-name {
    font-size: 0.8rem;
    font-weight: 300;
  }
`;

interface TeamProfileProps {
  teamInfo: Team | undefined;
  isHome: boolean;
}

const TeamProfile: React.FC<TeamProfileProps> = ({ teamInfo, isHome }) => {
  return (
    <TeamProfileStyle>
      {teamInfo ? (
        <TeamProfileHeader>
          <RetryableImage
            className="team-logo"
            src={teamInfo.logo}
            alt={teamInfo.name}
          />
          <div className="team-korean-name">
            {teamInfo.koreanName ? teamInfo.koreanName : teamInfo.name}
          </div>
          <div className="team-name">{teamInfo.name}</div>
        </TeamProfileHeader>
      ) : (
        <div>팀 정보가 없습니다</div>
      )}
    </TeamProfileStyle>
  );
};

export default TeamProfile;
