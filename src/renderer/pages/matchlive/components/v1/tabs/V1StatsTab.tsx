import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '@matchlive/store/store';
import { TeamStatistics } from '@app/v1/types/api';

interface V1StatsTabProps {
  isActive: boolean;
}

interface StatRowProps {
  label: string;
  homeValue?: number;
  awayValue?: number;
  isPercentage?: boolean;
}

const StatRow = ({ label, homeValue, awayValue, isPercentage }: StatRowProps) => {
  const home = homeValue ?? 0;
  const away = awayValue ?? 0;
  const total = home + away;
  const homePercent = total > 0 ? (home / total) * 100 : 50;
  const awayPercent = total > 0 ? (away / total) * 100 : 50;

  return (
    <StatRowContainer>
      <StatValue>{isPercentage ? `${home}%` : home}</StatValue>
      <StatBarSection>
        <StatLabel>{label}</StatLabel>
        <StatBar>
          <StatBarFill $percent={homePercent} $side="home" />
          <StatBarFill $percent={awayPercent} $side="away" />
        </StatBar>
      </StatBarSection>
      <StatValue>{isPercentage ? `${away}%` : away}</StatValue>
    </StatRowContainer>
  );
};

const V1StatsTab = ({ isActive }: V1StatsTabProps) => {
  const statistics = useSelector((state: RootState) => state.v1Fixture.statistics);

  if (!statistics) {
    return (
      <Container $isActive={isActive}>
        <EmptyMessage>통계 정보가 없습니다</EmptyMessage>
      </Container>
    );
  }

  const homeStats = statistics.home.teamStatistics;
  const awayStats = statistics.away.teamStatistics;

  return (
    <Container $isActive={isActive}>
      <StatsContent>
        <TeamNames>
          <TeamName>{statistics.home.team.koreanName || statistics.home.team.name}</TeamName>
          <TeamName>{statistics.away.team.koreanName || statistics.away.team.name}</TeamName>
        </TeamNames>

        <StatsSection>
          <SectionTitle>슈팅</SectionTitle>
          <StatRow
            label="전체 슈팅"
            homeValue={homeStats.totalShots}
            awayValue={awayStats.totalShots}
          />
          <StatRow
            label="유효 슈팅"
            homeValue={homeStats.shotsOnGoal}
            awayValue={awayStats.shotsOnGoal}
          />
          <StatRow
            label="빗나간 슈팅"
            homeValue={homeStats.shotsOffGoal}
            awayValue={awayStats.shotsOffGoal}
          />
          <StatRow
            label="차단된 슈팅"
            homeValue={homeStats.blockedShots}
            awayValue={awayStats.blockedShots}
          />
          <StatRow
            label="박스 안 슈팅"
            homeValue={homeStats.shotsInsideBox}
            awayValue={awayStats.shotsInsideBox}
          />
          <StatRow
            label="박스 밖 슈팅"
            homeValue={homeStats.shotsOutsideBox}
            awayValue={awayStats.shotsOutsideBox}
          />
        </StatsSection>

        <StatsSection>
          <SectionTitle>점유율 & 패스</SectionTitle>
          <StatRow
            label="점유율"
            homeValue={homeStats.ballPossession}
            awayValue={awayStats.ballPossession}
            isPercentage
          />
          <StatRow
            label="전체 패스"
            homeValue={homeStats.totalPasses}
            awayValue={awayStats.totalPasses}
          />
          <StatRow
            label="성공한 패스"
            homeValue={homeStats.passesAccurate}
            awayValue={awayStats.passesAccurate}
          />
        </StatsSection>

        <StatsSection>
          <SectionTitle>기타</SectionTitle>
          <StatRow
            label="코너킥"
            homeValue={homeStats.cornerKicks}
            awayValue={awayStats.cornerKicks}
          />
          <StatRow
            label="오프사이드"
            homeValue={homeStats.offsides}
            awayValue={awayStats.offsides}
          />
          <StatRow
            label="파울"
            homeValue={homeStats.fouls}
            awayValue={awayStats.fouls}
          />
          <StatRow
            label="세이브"
            homeValue={homeStats.goalkeeperSaves}
            awayValue={awayStats.goalkeeperSaves}
          />
          <StatRow
            label="옐로카드"
            homeValue={homeStats.yellowCards}
            awayValue={awayStats.yellowCards}
          />
          <StatRow
            label="레드카드"
            homeValue={homeStats.redCards}
            awayValue={awayStats.redCards}
          />
        </StatsSection>
      </StatsContent>
    </Container>
  );
};

const Container = styled.div<{ $isActive: boolean }>`
  width: 100%;
  height: 100%;
  padding: 140px 32px 32px;
  box-sizing: border-box;
  overflow-y: auto;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  pointer-events: ${(props) => (props.$isActive ? 'all' : 'none')};
  transition: opacity 0.3s ease;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const EmptyMessage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
`;

const StatsContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TeamNames = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 8px;
`;

const TeamName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const StatRowContainer = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  gap: 16px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: white;
  text-align: center;
`;

const StatBarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: 500;
`;

const StatBar = styled.div`
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: flex;
  overflow: hidden;
`;

const StatBarFill = styled.div<{ $percent: number; $side: 'home' | 'away' }>`
  height: 100%;
  width: ${(props) => props.$percent}%;
  background: ${(props) =>
    props.$side === 'home'
      ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
      : 'linear-gradient(90deg, #ef4444, #f87171)'};
  transition: width 0.5s ease;
`;

export default V1StatsTab;

