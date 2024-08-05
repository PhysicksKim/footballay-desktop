import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const FixtureIpc = () => {
  const dispatch = useDispatch();

  const requestFixtureInfo = () => {
    window.electron.ipcRenderer.send('to-app', {
      type: 'REQUEST_FIXTURE_INFO',
    });
  };

  const handleMessage = (...args: any[]) => {
    const message = args[0];
    const type = message.type;

    console.log('message', message);

    switch (type) {
      case 'REQUEST_FIXTURE_INFO': {
        requestFixtureInfo();
        break;
      }
      default: {
        console.log('Unknown message type:', type);
        break;
      }
    }
  };

  const receiveMessage = useEffect(() => {
    window.electron.ipcRenderer.on('to-matchlive', handleMessage);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('to-matchlive');
    };
  }, [dispatch]);

  return <></>;
};

export default FixtureIpc;
