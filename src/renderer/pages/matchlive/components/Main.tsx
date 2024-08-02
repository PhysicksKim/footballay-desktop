import React, { useEffect, useRef, useState } from 'react';
import '../styles/Body.scss';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from '../store/store';
import FixtureIpc from '../ipc/FixtureIpc';
import ControlIpc from '../ipc/ControlIpc';
import DragBar from './drag/DragBar';

const Main = () => {
  const [count, setCount] = useState(0);

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
        <p>Count: {count}</p>
        <button type="button" onClick={() => setCount(count + 1)}>
          Increase Count
        </button>
      </div>
    </div>
  );
};

export default Main;
