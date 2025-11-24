import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '@matchlive/store/store';
import { TeamStatistics } from '@app/v1/types/api';
import V1PassSuccessPieChart from './stats/V1PassSuccessPieChart';

interface V1StatsTabProps {
  isActive: boolean;
}

interface StatRowProps {
  label: string;
  homeValue?: number;
  awayValue?: number;
  isPercentage?: boolean;
}

const StatRow = ({
  label,
  homeValue,
  awayValue,
  isPercentage,
}: StatRowProps) => {
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
  const statistics = useSelector(
    (state: RootState) => state.v1Fixture.statistics
  );

  if (!statistics) {
    return (
      <Container $isActive={isActive}>
        <EmptyMessage>통계 정보가 없습니다</EmptyMessage>
      </Container>
    );
  }

  const homeStats = statistics.home.teamStatistics;
  const awayStats = statistics.away.teamStatistics;

  // Calculate pass accuracy percentage for pie chart
  const homePassAccuracy =
    homeStats.totalPasses && homeStats.totalPasses > 0
      ? Math.round(
          ((homeStats.passesAccurate || 0) / homeStats.totalPasses) * 100
        )
      : 0;

  const awayPassAccuracy =
    awayStats.totalPasses && awayStats.totalPasses > 0
      ? Math.round(
          ((awayStats.passesAccurate || 0) / awayStats.totalPasses) * 100
        )
      : 0;

  return (
    <Container $isActive={isActive}>
      <StatsContent>
        <TeamNames>
          <TeamName>
            {statistics.home.team.koreanName || statistics.home.team.name}
          </TeamName>
          <TeamName>
            {statistics.away.team.koreanName || statistics.away.team.name}
          </TeamName>
        </TeamNames>

        {/* Pass Success Pie Chart */}
        <StatsSection>
          <V1PassSuccessPieChart
            homePassSuccess={homePassAccuracy}
            awayPassSuccess={awayPassAccuracy}
          />
        </StatsSection>

        {/* Main Stats */}
        <StatsSection>
          <SectionTitle>주요 스텟</SectionTitle>
          <StatRow
            label="점유율"
            homeValue={homeStats.ballPossession}
            awayValue={awayStats.ballPossession}
            isPercentage
          />
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
            label="옐로카드"
            homeValue={homeStats.yellowCards}
            awayValue={awayStats.yellowCards}
          />
          <StatRow
            label="레드카드"
            homeValue={homeStats.redCards}
            awayValue={awayStats.redCards}
          />
          <StatRow
            label="세이브"
            homeValue={homeStats.goalkeeperSaves}
            awayValue={awayStats.goalkeeperSaves}
          />
        </StatsSection>

        {/* Detail Stats */}
        <StatsSection>
          <SectionTitle>세부 스텟</SectionTitle>
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
      </StatsContent>
    </Container>
  );
};

const Container = styled.div<{ $isActive: boolean }>`
  flex: 1;
  width: 100%;
  min-height: 0;
  padding: 32px;
  box-sizing: border-box;
  overflow-y: auto;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  user-select: auto;
  transition: opacity 0.3s ease;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  color: #fff;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const EmptyMessage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
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
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  text-shadow: none;
`;

const StatsSection = styled.div`
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
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
  color: #111;
  text-align: center;
`;

const StatBarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #555;
  text-align: center;
  font-weight: 600;
`;

const StatBar = styled.div`
  height: 8px;
  background: #eee;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
`;

const StatBarFill = styled.div<{ $percent: number; $side: 'home' | 'away' }>`
  height: 100%;
  width: ${(props) => props.$percent}%;
  background: ${(props) =>
    props.$side === 'home'
      ? '#3b82f6' // Solid Blue
      : '#ef4444'}; // Solid Red
  transition: width 0.5s ease;
`;

export default V1StatsTab;
