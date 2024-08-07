import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const PrintDataString = () => {
  const fixutreId = useSelector((state: RootState) => state.fixture.fixtureId);
  const fixtureInfo = useSelector((state: RootState) => state.fixture.info);
  const fixtureLineup = useSelector((state: RootState) => state.fixture.lineup);
  const fixtureEvents = useSelector((state: RootState) => state.fixture.events);
  const fixtureLiveStatus = useSelector(
    (state: RootState) => state.fixture.liveStatus,
  );

  return (
    <div className="print-data-container">
      <div className="fixture-info">{JSON.stringify(fixtureInfo)}</div>
      <div className="fixture-lineup">{JSON.stringify(fixtureLineup)}</div>
      <div className="fixture-events">{JSON.stringify(fixtureEvents)}</div>
      <div className="fixture-live-status">
        {JSON.stringify(fixtureLiveStatus)}
      </div>
    </div>
  );
};

export default PrintDataString;
