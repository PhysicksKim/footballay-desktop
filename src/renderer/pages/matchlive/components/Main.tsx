import React, { useEffect, useRef, useState } from 'react';
import '../Body.scss';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from '../store/store';
import FixtureIpc from '../ipc/FixtureIpc';
import { Route, Router } from 'react-router-dom';

const Main = () => {
  const [count, setCount] = useState(0);
  const fixtureId = useSelector((state: RootState) => state.fixture.fixtureId);

  const receiveFromMain = () => {
    console.log('Receive from Main fuction executed');
    const { ipcRenderer } = window.electron;
    ipcRenderer.on('main-to-sub', (msg: any) => {
      console.log('Received from Main:', msg);
    });
  };

  useEffect(() => {
    receiveFromMain();
  }, []);

  return (
    <div>
      <h1>Test Window</h1>
      <FixtureIpc />

      <div className="drag-area">여기를 끌어 드래그</div>
      <div className="contents-area">
        <p>Count: {count}</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Increase Count
        </button>
      </div>
    </div>
  );
};

export default Main;
