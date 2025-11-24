import { useSelector } from 'react-redux';
import styled, { keyframes, css } from 'styled-components';
import { RootState } from '@matchlive/store/store';
import { V1ActiveTab } from './V1Layout';

interface V1HeaderProps {
  activeTab: V1ActiveTab;
  onTabChange: (tab: V1ActiveTab) => void;
  $isAbsolute?: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const V1Header = ({
  activeTab,
  onTabChange,
  $isAbsolute = true,
}: V1HeaderProps) => {
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
    <HeaderContainer $isAbsolute={$isAbsolute}>
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

      <TabSelector>
        <TabButton
          $active={activeTab === 'lineup'}
          onClick={() => onTabChange('lineup')}
        >
          라인업
        </TabButton>
        <TabButton
          $active={activeTab === 'stats'}
          onClick={() => onTabChange('stats')}
        >
          통계
        </TabButton>
        <TabButton
          $active={activeTab === 'events'}
          onClick={() => onTabChange('events')}
        >
          이벤트
        </TabButton>
      </TabSelector>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div<{ $isAbsolute: boolean }>`
  position: ${(props) => (props.$isAbsolute ? 'absolute' : 'relative')};
  top: ${(props) => (props.$isAbsolute ? '0' : 'auto')};
  left: ${(props) => (props.$isAbsolute ? '0' : 'auto')};
  right: ${(props) => (props.$isAbsolute ? '0' : 'auto')};
  padding: 16px 24px 12px 24px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  backdrop-filter: blur(8px);
  z-index: ${(props) => (props.$isAbsolute ? '100' : '1')};
  animation: ${fadeIn} 0.3s ease forwards;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-app-region: drag;
  pointer-events: all;
  user-select: none;
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
  width: 100%;
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  flex: 1;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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

const TabSelector = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 8px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border: none;
  background: ${(props) =>
    props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${(props) => (props.$active ? 'white' : 'rgba(255, 255, 255, 0.6)')};
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }
`;

export default V1Header;
