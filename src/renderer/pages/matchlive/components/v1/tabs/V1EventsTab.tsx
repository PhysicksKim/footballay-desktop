import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '@matchlive/store/store';
import { EventInfo } from '@app/v1/types/api';

interface V1EventsTabProps {
  isActive: boolean;
}

const getEventIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'goal':
      return '⚽';
    case 'card':
      return '🟨';
    case 'subst':
      return '🔄';
    default:
      return '•';
  }
};

const getEventColor = (type: string, detail?: string) => {
  if (type.toLowerCase() === 'card') {
    if (detail?.toLowerCase().includes('red')) {
      return '#ef4444';
    }
    return '#fbbf24';
  }
  if (type.toLowerCase() === 'goal') {
    return '#10b981';
  }
  return 'rgba(255, 255, 255, 0.6)';
};

const EventCard = ({ event }: { event: EventInfo }) => {
  const icon = getEventIcon(event.type);
  const color = getEventColor(event.type, event.detail);

  return (
    <EventCardContainer>
      <EventTime>
        {event.elapsed}
        {event.extraTime ? `+${event.extraTime}` : ''}
      </EventTime>
      <EventContent>
        <EventIcon style={{ color }}>{icon}</EventIcon>
        <EventDetails>
          <EventType style={{ color }}>{event.detail || event.type}</EventType>
          <EventPlayer>
            {event.player?.koreanName || event.player?.name || ''}
            {event.assist && (
              <AssistInfo>
                (도움: {event.assist.koreanName || event.assist.name})
              </AssistInfo>
            )}
          </EventPlayer>
          {event.comments && <EventComments>{event.comments}</EventComments>}
        </EventDetails>
        <TeamBadge>{event.team.koreanName || event.team.name}</TeamBadge>
      </EventContent>
    </EventCardContainer>
  );
};

const V1EventsTab = ({ isActive }: V1EventsTabProps) => {
  const events = useSelector((state: RootState) => state.v1Fixture.events);

  if (!events || events.events.length === 0) {
    return (
      <Container $isActive={isActive}>
        <EmptyMessage>이벤트 정보가 없습니다</EmptyMessage>
      </Container>
    );
  }

  // Sort events by elapsed time (descending - most recent first)
  const sortedEvents = [...events.events].sort((a, b) => {
    const aTime = a.elapsed + (a.extraTime || 0);
    const bTime = b.elapsed + (b.extraTime || 0);
    return bTime - aTime;
  });

  return (
    <Container $isActive={isActive}>
      <EventsContent>
        <Title>경기 타임라인</Title>
        <EventsList>
          {sortedEvents.map((event) => (
            <EventCard
              key={`${event.sequence}-${event.elapsed}`}
              event={event}
            />
          ))}
        </EventsList>
      </EventsContent>
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

const EventsContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EventCardContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(4px);
  }
`;

const EventTime = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: white;
  min-width: 50px;
  text-align: right;
  padding-top: 2px;
`;

const EventContent = styled.div`
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const EventIcon = styled.div`
  font-size: 24px;
  line-height: 1;
  padding-top: 2px;
`;

const EventDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EventType = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EventPlayer = styled.div`
  font-size: 15px;
  color: white;
  font-weight: 500;
`;

const AssistInfo = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  margin-left: 4px;
`;

const EventComments = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
`;

const TeamBadge = styled.div`
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  align-self: flex-start;
`;

export default V1EventsTab;
