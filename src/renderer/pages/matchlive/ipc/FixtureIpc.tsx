import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setFixtureId,
  setReferee,
  setDate,
  setLeague,
  setLiveStatus,
  setHome,
  setAway,
  setEvents,
  setLineup,
  setLastFetchTime,
} from '../store/slices/fixtureSlice';

const FixtureIpc = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (...args: any[]) => {
      const message = args[0];
      console.log('Received message:', message);

      switch (message.type) {
        case 'fixtureId':
          dispatch(setFixtureId(message.data));
          break;
        case 'referee':
          dispatch(setReferee(message.data));
          break;
        case 'date':
          dispatch(setDate(message.data));
          break;
        case 'league':
          dispatch(setLeague(message.data));
          break;
        case 'liveStatus':
          dispatch(setLiveStatus(message.data));
          break;
        case 'home':
          dispatch(setHome(message.data));
          break;
        case 'away':
          dispatch(setAway(message.data));
          break;
        case 'events':
          dispatch(setEvents(message.data));
          break;
        case 'lineup':
          dispatch(setLineup(message.data));
          break;
        case 'lastFetchTime':
          dispatch(setLastFetchTime(message.data));
          break;
        default:
          console.warn(`Unhandled message type: ${message.type}`);
      }
    };

    window.electron.ipcRenderer.on('main-to-sub', handleMessage);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('main-to-sub');
    };
  }, [dispatch]);

  return <></>;
};

export default FixtureIpc;
