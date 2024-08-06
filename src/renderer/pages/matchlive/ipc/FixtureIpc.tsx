import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFixtureEvents,
  setFixtureId,
  setFixtureInfo,
  setFixtureLineup,
  setFixtureLiveStatus,
} from '@matchlive/store/slices/fixtureSlice';
import { RootState } from '../store/store';

export type ReceiveIpcType =
  | 'SET_FIXTURE_ID'
  | 'SET_FIXTURE_INFO'
  | 'SET_LIVE_STATUS'
  | 'SET_LINEUP'
  | 'SET_EVENTS';
export type SendIpcType =
  | 'GET_FIXTURE_ID'
  | 'GET_FIXTURE_INFO'
  | 'GET_LIVE_STATUS'
  | 'GET_LINEUP'
  | 'GET_EVENTS';
export interface IpcMessage {
  type: ReceiveIpcType;
  data?: any;
}

const requestFixtureInitialLiveData = () => {
  window.electron.ipcRenderer.send('to-app', {
    type: 'GET_FIXTURE_LIVE_STATUS',
  });
  window.electron.ipcRenderer.send('to-app', { type: 'GET_FIXTURE_LINEUP' });
  window.electron.ipcRenderer.send('to-app', { type: 'GET_FIXTURE_EVENTS' });
};

const FixtureIpc = () => {
  const dispatch = useDispatch();
  const fixtureId = useSelector((state: RootState) => state.fixture.fixtureId);
  const fixtureInfo = useSelector((state: RootState) => state.fixture.info);

  const handleMessage = (...args: IpcMessage[]) => {
    const { type, data } = args[0];

    console.log('message', args);
    switch (type) {
      case 'SET_FIXTURE_ID': {
        console.log('SET_FIXTURE_ID', data);
        dispatch(setFixtureId(data));
        break;
      }
      case 'SET_FIXTURE_INFO': {
        console.log('SET_FIXTURE_INFO', data);
        if (!data) {
          setTimeout(() => {
            sendFixtureInfoRequest();
          }, 1000);
        } else {
          dispatch(setFixtureInfo(data));
          requestFixtureInitialLiveData();
        }
        break;
      }
      case 'SET_LIVE_STATUS': {
        dispatch(setFixtureLiveStatus(data));
        console.log('SET_LIVE_STATUS', data);
        break;
      }
      case 'SET_LINEUP': {
        dispatch(setFixtureLineup(data));
        console.log('SET_LINEUP', data);
        break;
      }
      case 'SET_EVENTS': {
        dispatch(setFixtureEvents(data));
        console.log('SET_EVENTS', data);
        break;
      }
      default: {
        console.log('Unknown message type:', type);
        break;
      }
    }
  };

  useEffect(() => {
    sendFixtureInfoRequest();
  }, [fixtureId]);

  const sendFixtureInfoRequest = () => {
    window.electron.ipcRenderer.send('to-app', { type: 'GET_FIXTURE_INFO' });
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
