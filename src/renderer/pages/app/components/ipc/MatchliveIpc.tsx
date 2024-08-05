import { RootState } from '@app/store/store';
import { ar } from 'date-fns/locale';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWaitFixtureInfo } from '@app/store/slices/ipc/ipcStatusSlice';
import { fetchFixtureInfo } from '../../store/slices/fixtureLiveSliceThunk';

const MatchliveIpc = () => {
  console.log('MatchliveIpc');

  const dispatch = useDispatch();

  const waitFixtureInfo = useSelector(
    (state: RootState) => state.ipcStatus.waitFixtureInfo,
  );
  const selectedFixtureId = useSelector(
    (state: RootState) => state.fixtureLive.fixtureId,
  );
  const fixtureInfo = useSelector((state: RootState) => state.fixtureLive.info);

  const handleMessage = (...args: any[]) => {
    const type = args[0].type;
    const data = args[0].data;
    console.log('args:', args);
    console.log('type:', type);
    console.log('data:', data);
    switch (type) {
      case 'REQUEST_FIXTURE_INFO':
        console.log('REQUEST_FIXTURE_INFO received');
        dispatch(setWaitFixtureInfo(true));
        sendFixtureInfo();
        console.log('send fixture info');
        break;
      default:
        console.log('default');
    }
  };

  const sendFixtureInfo = () => {
    window.electron.ipcRenderer.send('to-matchlive', {
      type: 'FIXTURE_INFO',
      data: fixtureInfo,
    });
  };

  const createIpcMessage = (type: string, data: any) => {
    return { type, data };
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('to-app', handleMessage);
  }, []);

  return <></>;
};

export default MatchliveIpc;
