import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '@matchlive/store/store';
import { LineupPlayer } from '@app/v1/types/api';

interface V1LineupTabProps {
  isActive: boolean;
}

const V1LineupTab = ({ isActive }: V1LineupTabProps) => {
  const lineup = useSelector((state: RootState) => state.v1Fixture.lineup);

  if (!lineup) {
    return (
      <Container $isActive={isActive}>
        <EmptyMessage>라인업 정보가 없습니다</EmptyMessage>
      </Container>
    );
  }

  const { home, away } = lineup.lineup;

  return (
    <Container $isActive={isActive}>
      <LineupGrid>
        <TeamLineup>
          <FormationBadge>{home.formation || 'N/A'}</FormationBadge>
          <TeamName>{home.teamKoreanName || home.teamName}</TeamName>
          <PlayersList>
            {home.players.map((player) => (
              <PlayerCard key={player.matchPlayerUid}>
                <PlayerNumber>{player.number || '?'}</PlayerNumber>
                <PlayerInfo>
                  <PlayerName>{player.koreanName || player.name}</PlayerName>
                  {player.position && <PlayerPosition>{player.position}</PlayerPosition>}
                </PlayerInfo>
              </PlayerCard>
            ))}
          </PlayersList>
          <SubstitutesHeader>교체 멤버</SubstitutesHeader>
          <PlayersList>
            {home.substitutes.map((player) => (
              <PlayerCard key={player.matchPlayerUid} $isSub>
                <PlayerNumber>{player.number || '?'}</PlayerNumber>
                <PlayerInfo>
                  <PlayerName>{player.koreanName || player.name}</PlayerName>
                  {player.position && <PlayerPosition>{player.position}</PlayerPosition>}
                </PlayerInfo>
              </PlayerCard>
            ))}
          </PlayersList>
        </TeamLineup>

        <Divider />

        <TeamLineup>
          <FormationBadge>{away.formation || 'N/A'}</FormationBadge>
          <TeamName>{away.teamKoreanName || away.teamName}</TeamName>
          <PlayersList>
            {away.players.map((player) => (
              <PlayerCard key={player.matchPlayerUid}>
                <PlayerNumber>{player.number || '?'}</PlayerNumber>
                <PlayerInfo>
                  <PlayerName>{player.koreanName || player.name}</PlayerName>
                  {player.position && <PlayerPosition>{player.position}</PlayerPosition>}
                </PlayerInfo>
              </PlayerCard>
            ))}
          </PlayersList>
          <SubstitutesHeader>교체 멤버</SubstitutesHeader>
          <PlayersList>
            {away.substitutes.map((player) => (
              <PlayerCard key={player.matchPlayerUid} $isSub>
                <PlayerNumber>{player.number || '?'}</PlayerNumber>
                <PlayerInfo>
                  <PlayerName>{player.koreanName || player.name}</PlayerName>
                  {player.position && <PlayerPosition>{player.position}</PlayerPosition>}
                </PlayerInfo>
              </PlayerCard>
            ))}
          </PlayersList>
        </TeamLineup>
      </LineupGrid>
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

const LineupGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TeamLineup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormationBadge = styled.div`
  align-self: center;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  letter-spacing: 1px;
`;

const TeamName = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PlayerCard = styled.div<{ $isSub?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${(props) =>
    props.$isSub ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(8px);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
  }
`;

const PlayerNumber = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const PlayerName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const PlayerPosition = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SubstitutesHeader = styled.div`
  margin-top: 8px;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Divider = styled.div`
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 8px;
`;

export default V1LineupTab;

