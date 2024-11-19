import {
  FixtureEvent,
  FixtureEventMeta,
  SubstMeta,
} from '@src/types/FixtureIpc';
import React from 'react';

import '@app/styles/tabs/FixtureEventList.scss';

interface EventListProps {
  events: FixtureEvent[] | undefined;
  meta: FixtureEventMeta[];
  isFiltered: boolean;
  handleEventClick: (event: FixtureEvent) => void;
}

const translateEventType = (type: string, detail: string): string => {
  const typeLowerCase = type.toLowerCase();
  const detailLowerCase = detail.toLowerCase();

  switch (typeLowerCase) {
    case 'goal':
      return '골';
    case 'card':
      if (detailLowerCase.includes('yellow')) {
        return '경고';
      } else if (detailLowerCase.includes('red')) {
        return '퇴장';
      } else {
        return '카드';
      }
    case 'subst':
      return '교체';
    default:
      return type;
  }
};

const substDetailSubInOut = (
  event: FixtureEvent,
  meta: FixtureEventMeta,
): string => {
  if (event.type.toLowerCase() !== 'subst') {
    console.error('Event type is not subst');
    return 'ERROR';
  }
  if (!event || !meta || event.sequence !== meta.sequence) {
    console.error(
      'Event sequence does not match with meta sequence : event and meta',
      event,
      meta,
    );
    return 'ERROR';
  }

  const substMeta = meta.data as SubstMeta;
  const { inPlayer, outPlayer } =
    substMeta.inPlayer === 'player'
      ? { inPlayer: event.player, outPlayer: event.assist }
      : { inPlayer: event.assist, outPlayer: event.player };

  const outName = outPlayer?.koreanName || outPlayer?.name || 'ERROR';
  const inName = inPlayer?.koreanName || inPlayer?.name || 'ERROR';
  return `${outName} → ${inName}`;
};

const FixtureEventList: React.FC<EventListProps> = ({
  events,
  meta,
  isFiltered,
  handleEventClick,
}) => {
  return (
    <div
      className={
        `event-filter__${isFiltered ? 'filtered' : 'applied'}-list` +
        ' event-filter-container'
      }
    >
      <h3 className="event-filter__title">
        {isFiltered ? '제외된 이벤트' : '이벤트 리스트'}
      </h3>
      <div className="event-filter__table-wrapper">
        <table className="event-filter__table">
          <thead className="event-filter__thead">
            <tr className="event-filter__legend">
              <th className="event-filter__legend-item event-filter__legend-item--elapsed">
                분
              </th>
              <th className="event-filter__legend-item event-filter__legend-item--type">
                유형
              </th>
              <th className="event-filter__legend-item event-filter__legend-item--team">
                팀
              </th>
              <th className="event-filter__legend-item event-filter__legend-item--player">
                선수
              </th>
            </tr>
          </thead>
          <tbody className="event-filter__body">
            {events &&
              events.map((event, index) => (
                <tr
                  key={index}
                  className={`event-filter__item ${isFiltered ? 'event-filter__item--filtered' : ''}`}
                  onClick={() => handleEventClick(event)}
                >
                  <td className="event-filter__item-detail event-filter__item-detail--elapsed">
                    {event.elapsed}{' '}
                    {event.extraTime ? '+' + event.extraTime : ''}
                  </td>
                  <td className="event-filter__item-detail event-filter__item-detail--type">
                    {translateEventType(event.type, event.detail)}
                  </td>
                  <td className="event-filter__item-detail event-filter__item-detail--team">
                    {event.team.koreanName || event.team.name}
                  </td>
                  <td className="event-filter__item-detail event-filter__item-detail--player">
                    {event.type.toLowerCase() === 'subst'
                      ? substDetailSubInOut(
                          event,
                          meta.find((m) => m.sequence === event.sequence)!,
                        )
                      : event?.player?.koreanName || event?.player?.name || ''}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixtureEventList;
