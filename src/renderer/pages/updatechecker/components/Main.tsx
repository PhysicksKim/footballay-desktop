import { electron } from 'process';
import React, { useEffect } from 'react';

const Main = () => {
  const handleMessage = (event: any, message: any) => {
    console.log('handleMessage', message);
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('to-updatechecker', handleMessage);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('to-updatechecker');
    };
  }, []);

  return <div>Main</div>;
};

export default Main;
