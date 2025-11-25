import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  setFixtureEvents,
  setFixtureInfo,
  setFixtureLineup,
  setFixtureLiveStatus,
  setFixtureStatistics,
} from '@matchlive/store/slices/fixtureSlice';
import { loadColorOption } from '@matchlive/store/slices/colorOptionSlice';
import { setFilterEvents } from '@matchlive/store/slices/control/eventFilterSlice';
import { LiveOutboundMessage } from '@src/types/ipc/LiveChannels';
import { AppDispatch } from '@matchlive/store/store';

const FixtureIpc = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'live:to-matchlive',
      (message: LiveOutboundMessage) => {
        if (!message) return;
        switch (message.type) {
          case 'live.fixture.info':
            dispatch(setFixtureInfo(message.payload));
            break;
          case 'live.fixture.live-status':
            dispatch(setFixtureLiveStatus(message.payload));
        break;
          case 'live.fixture.lineup':
            dispatch(setFixtureLineup(message.payload));
        break;
          case 'live.fixture.events':
            dispatch(setFixtureEvents(message.payload));
        break;
          case 'live.fixture.statistics':
            dispatch(setFixtureStatistics(message.payload));
        break;
          case 'live.event-filter.update':
            dispatch(setFilterEvents(message.payload));
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
        window.electron.ipcRenderer.removeAllListeners('live:to-matchlive');
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Request full sync only once on mount
    window.electron.ipcRenderer.send('live:request-data', {
      type: 'live.request.full-sync',
    });

    // Load color option from Electron Store
    dispatch(loadColorOption());
  }, [dispatch]);

  return null;
};

export default FixtureIpc;
