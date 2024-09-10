import { FixtureEvent } from '@src/types/FixtureIpc';
import React from 'react';

import '@app/styles/tabs/FixtureEventList.scss';

interface Event {
  elapsed: number;
  extraTime?: number;
  type: string;
  player: { name: string };
  team: { name: string };
}

interface EventListProps {
  events: FixtureEvent[] | undefined;
  isFiltered: boolean;
  handleEventClick: (event: FixtureEvent) => void;
}

const FixtureEventList: React.FC<EventListProps> = ({
  events,
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
                    {event.type}
                  </td>
                  <td className="event-filter__item-detail event-filter__item-detail--team">
                    {event.team.name}
                  </td>
                  <td className="event-filter__item-detail event-filter__item-detail--player">
                    {event.player.name}
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
