import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '@matchlive/store/store';

const V1Header = () => {
  const info = useSelector((state: RootState) => state.v1Fixture.info);
  const liveStatus = useSelector(
    (state: RootState) => state.v1Fixture.liveStatus
  );

  if (!info) {
    return null;
  }

  const homeTeam = info.home;
  const awayTeam = info.away;
  const score = liveStatus?.liveStatus.score;
  const status = liveStatus?.liveStatus;

  return (
    <HeaderContainer>
      <LeagueInfo>
        {info.league.logo && <LeagueLogo src={info.league.logo} alt="" />}
        <LeagueName>{info.league.koreanName || info.league.name}</LeagueName>
      </LeagueInfo>

      <MatchInfo>
        <TeamSection>
          <TeamLogo src={homeTeam.logo} alt="" />
          <TeamName>{homeTeam.koreanName || homeTeam.name}</TeamName>
        </TeamSection>

        <ScoreSection>
          {score ? (
            <>
              <Score>
                {score.home} : {score.away}
              </Score>
              <Status>
                {status?.longStatus}
                {status?.elapsed !== undefined && ` · ${status.elapsed}'`}
              </Status>
            </>
          ) : (
            <Status>{status?.longStatus || 'VS'}</Status>
          )}
        </ScoreSection>

        <TeamSection>
          <TeamLogo src={awayTeam.logo} alt="" />
          <TeamName>{awayTeam.koreanName || awayTeam.name}</TeamName>
        </TeamSection>
      </MatchInfo>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
  backdrop-filter: blur(8px);
  z-index: 100;
  pointer-events: none;
`;

const LeagueInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  justify-content: center;
`;

const LeagueLogo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const LeagueName = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const MatchInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
`;

const TeamLogo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const TeamName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 100px;
`;

const Score = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
`;

const Status = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

export default V1Header;

