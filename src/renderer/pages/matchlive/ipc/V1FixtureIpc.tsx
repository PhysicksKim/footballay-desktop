import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  setV1FixtureEvents,
  setV1FixtureInfo,
  setV1FixtureLineup,
  setV1FixtureLiveStatus,
  setV1FixtureStatistics,
} from '@matchlive/store/slices/v1FixtureSlice';
import { V1OutboundMessage } from '@src/types/ipc/V1Channels';

const V1FixtureIpc = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'v1:to-matchlive',
      (message: V1OutboundMessage) => {
        if (!message) return;
        switch (message.type) {
          case 'v1.fixture.info':
            dispatch(setV1FixtureInfo(message.payload));
            break;
          case 'v1.fixture.live-status':
            dispatch(setV1FixtureLiveStatus(message.payload));
            break;
          case 'v1.fixture.lineup':
            dispatch(setV1FixtureLineup(message.payload));
            break;
          case 'v1.fixture.events':
            dispatch(setV1FixtureEvents(message.payload));
            break;
          case 'v1.fixture.statistics':
            dispatch(setV1FixtureStatistics(message.payload));
            break;
          default:
            break;
        }
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      } else {
        window.electron.ipcRenderer.removeAllListeners('v1:to-matchlive');
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Request full sync only once on mount
    window.electron.ipcRenderer.send('v1:request-data', {
      type: 'v1.request.full-sync',
    });
  }, []);

  return null;
};

export default V1FixtureIpc;

