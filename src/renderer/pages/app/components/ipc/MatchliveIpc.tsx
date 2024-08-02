import { RootState } from '@app/store/store';
import { ar } from 'date-fns/locale';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWaitFixtureInfo } from '@app/store/slices/ipc/ipcStatusSlice';

const MatchliveIpc = () => {
  console.log('MatchliveIpc');

  const dispatch = useDispatch();

  const waitFixtureInfo = useSelector(
    (state: RootState) => state.ipcStatus.waitFixtureInfo,
  );

  const handleMessage = (...args: any[]) => {
    const type = args[0].type;

    console.log('type:', type);
    switch (type) {
      case 'REQUEST_FIXTURE_INFO':
        console.log('REQUEST_FIXTURE_INFO received');
        dispatch(setWaitFixtureInfo(true));
        break;
      default:
        console.log('default');
        break;
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('to-app', handleMessage);
  }, []);

  return <></>;
};

export default MatchliveIpc;
