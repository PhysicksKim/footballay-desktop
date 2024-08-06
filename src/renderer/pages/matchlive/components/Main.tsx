import React, { useEffect, useRef, useState } from 'react';
import '../styles/Body.scss';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from '../store/store';
import FixtureIpc from '../ipc/FixtureIpc';
import ControlIpc from '../ipc/ControlIpc';
import DragBar from './drag/DragBar';

const Main = () => {
  const [count, setCount] = useState(0);

  const fixutreId = useSelector((state: RootState) => state.fixture.fixtureId);
  const fixtureInfo = useSelector((state: RootState) => state.fixture.info);
  const fixtureLineup = useSelector((state: RootState) => state.fixture.lineup);
  const fixtureEvents = useSelector((state: RootState) => state.fixture.events);
  const fixtureLiveStatus = useSelector(
    (state: RootState) => state.fixture.liveStatus,
  );

  return (
    <div className="root-container">
      <>
        <DragBar />
      </>
      <>
        <FixtureIpc />
        <ControlIpc />
      </>
      {/* <div className="drag-area">여기를 끌어 드래그</div> */}
      <div className="contents-area">
        <div className="fixture-info">{JSON.stringify(fixtureInfo)}</div>
        <div className="fixture-lineup">{JSON.stringify(fixtureLineup)}</div>
        <div className="fixture-events">{JSON.stringify(fixtureEvents)}</div>
        <div className="fixture-live-status">
          {JSON.stringify(fixtureLiveStatus)}
        </div>
      </div>
    </div>
  );
};

export default Main;
