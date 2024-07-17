import React, { useEffect, useRef, useState } from 'react';
import './Body.scss';

const Application = () => {
  const [count, setCount] = useState(0);

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

export default Application;
