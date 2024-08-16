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
import { setShowPhoto } from '../store/slices/fixtureLiveOptionSlice';

export type ReceiveIpcType =
  | 'SET_FIXTURE_ID'
  | 'SET_FIXTURE_INFO'
  | 'SET_LIVE_STATUS'
  | 'SET_LINEUP'
  | 'SET_EVENTS'
  | 'SET_SHOW_PHOTO';
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

    switch (type) {
      case 'SET_FIXTURE_ID': {
        dispatch(setFixtureId(data));
        break;
      }
      case 'SET_FIXTURE_INFO': {
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
        break;
      }
      case 'SET_LINEUP': {
        dispatch(setFixtureLineup(data));
        break;
      }
      case 'SET_EVENTS': {
        dispatch(setFixtureEvents(data));
        break;
      }
      case 'SET_SHOW_PHOTO': {
        dispatch(setShowPhoto(data));
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    sendFixtureInfoRequest();
  }, [fixtureId]);

  useEffect(() => {
    sendMatchliveReactReady();
  }, []);

  const sendFixtureInfoRequest = () => {
    window.electron.ipcRenderer.send('to-app', { type: 'GET_FIXTURE_INFO' });
  };

  const sendMatchliveReactReady = () => {
    window.electron.ipcRenderer.send('matchlive-react-ready');
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
