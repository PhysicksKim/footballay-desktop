import { Team } from '@src/types/FixtureIpc';
import { stat } from 'fs';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import RetryableImage from '../../common/RetryableImage';

const TeamProfileStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #dad8d8;
`;

const TeamProfileHeader = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background-color: #f5f5f5;
  box-sizing: border-box;

  padding-top: 15px;
  padding-bottom: 10px;

  .team-logo {
    width: 100px;
    height: 100px;
  }

  .team-korean-name {
    font-size: 1.4rem;
    font-weight: 500;
  }
  .team-name {
    font-size: 1rem;
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
          <div className="team-korean-name">{teamInfo.koreanName}</div>
          <div className="team-name">{teamInfo.name}</div>
        </TeamProfileHeader>
      ) : (
        <div>팀 정보가 없습니다</div>
      )}
    </TeamProfileStyle>
  );
};

export default TeamProfile;
