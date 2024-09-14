import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFixtureEvents,
  setFixtureId,
  setFixtureInfo,
  setFixtureLineup,
  setFixtureLiveStatus,
} from '@matchlive/store/slices/fixtureSlice';
import { setProcessedLineup } from '@matchlive/store/slices/fixtureProcessedDataSlice';
import { RootState } from '@matchlive/store/store';
import { setShowPhoto } from '@matchlive/store/slices/fixtureLiveOptionSlice';

export type ReceiveIpcType =
  | 'SET_FIXTURE_ID'
  | 'SET_FIXTURE_INFO'
  | 'SET_LIVE_STATUS'
  | 'SET_LINEUP'
  | 'SET_EVENTS'
  | 'SET_SHOW_PHOTO'
  | 'SET_PROCESSED_LINEUP';
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
  window.electron.ipcRenderer.send('to-app', { type: 'GET_PROCESSED_LINEUP' });
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
      case 'SET_PROCESSED_LINEUP': {
        dispatch(setProcessedLineup(data));
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

  useEffect(() => {
    getShowPhoto();
  }, []);

  const sendFixtureInfoRequest = () => {
    window.electron.ipcRenderer.send('to-app', { type: 'GET_FIXTURE_INFO' });
  };

  const sendMatchliveReactReady = () => {
    window.electron.ipcRenderer.send('matchlive-react-ready');
  };

  const getShowPhoto = () => {
    console.log('getShowPhoto called');
    window.electron.ipcRenderer.send('to-app', {
      type: 'SEND_SHOW_PHOTO',
    });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('to-matchlive', handleMessage);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('to-matchlive');
    };
  }, [dispatch]);

  return <></>;
};

export default FixtureIpc;
