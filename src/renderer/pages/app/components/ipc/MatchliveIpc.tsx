import { RootState } from '@app/store/store';
import { ar } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWaitFixtureInfo } from '@app/store/slices/ipc/ipcStatusSlice';
import { fetchFixtureInfo } from '../../store/slices/fixtureLiveSliceThunk';
import {
  resetInitTaskState,
  setMatchliveWindowReady,
} from '../../store/slices/fixtureLiveSlice';
import {
  FixtureEvent,
  FixtureEventResponse,
  FixtureInfo,
  FixtureLineup,
  FixtureLiveStatus,
} from '@src/types/FixtureIpc';

export type ReceiveIpcType =
  | 'MATCHLIVE_WINDOW_READY'
  | 'GET_FIXTURE_INFO'
  | 'GET_FIXTURE_LIVE_STATUS'
  | 'GET_FIXTURE_LINEUP'
  | 'GET_FIXTURE_EVENTS';
// export type SendIpcType =
export interface IpcMessage {
  type: ReceiveIpcType;
  data?: any;
}

const sendFixtureId = (selectedFixtureId: number) => {
  console.log('sendFixtureId:', selectedFixtureId);
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_FIXTURE_ID',
    data: selectedFixtureId,
  });
};

const sendFixtureInfo = (fixtureInfo: FixtureInfo | null) => {
  console.log('sendFixtureInfo:', fixtureInfo);
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_FIXTURE_INFO',
    data: fixtureInfo,
  });
};

const sendLiveStatus = (fixtureLiveStatus: FixtureLiveStatus | null) => {
  console.log('sendLiveStatus:', fixtureLiveStatus);
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_LIVE_STATUS',
    data: fixtureLiveStatus,
  });
};

const sendLineup = (fixtureLineup: FixtureLineup | null) => {
  console.log('sendLineup:', fixtureLineup);
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_LINEUP',
    data: fixtureLineup,
  });
};

const sendEvents = (fixtureEvents: FixtureEventResponse | null) => {
  console.log('sendEvents:', fixtureEvents);
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_EVENTS',
    data: fixtureEvents,
  });
};

const MatchliveIpc = () => {
  const dispatch = useDispatch();

  const selectedFixtureId = useSelector(
    (state: RootState) => state.fixtureLive.fixtureId,
  );
  const fixtureInfo = useSelector((state: RootState) => state.fixtureLive.info);
  const fixtureLiveStatus = useSelector(
    (state: RootState) => state.fixtureLive.liveStatus,
  );
  const fixtureLineup = useSelector(
    (state: RootState) => state.fixtureLive.lineup,
  );
  const fixtureEvents = useSelector(
    (state: RootState) => state.fixtureLive.events,
  );

  const initTaskState = useSelector(
    (state: RootState) => state.fixtureLive.taskState.init,
  );

  const [getFixtureInfoFlag, setGetFixtureInfoFlag] = useState(false);

  const handleMessage = (...args: IpcMessage[]) => {
    const { type, data } = args[0];
    console.log('ipc message args:', args);
    switch (type) {
      case 'MATCHLIVE_WINDOW_READY':
        dispatch(setMatchliveWindowReady(true));
        break;
      case 'GET_FIXTURE_INFO':
        setGetFixtureInfoFlag(true);
        break;
      case 'GET_FIXTURE_LIVE_STATUS':
        sendLiveStatus(fixtureLiveStatus);
        break;
      case 'GET_FIXTURE_LINEUP':
        sendLineup(fixtureLineup);
        break;
      case 'GET_FIXTURE_EVENTS':
        sendEvents(fixtureEvents);
        break;
      default:
        console.log('unexpected IPC message type :', type);
    }
  };

  useEffect(() => {
    console.log('initTaskState:', initTaskState);
    if (
      initTaskState.fixtureIdUpdated &&
      initTaskState.matchliveWindowReady &&
      initTaskState.fixtureLiveStateReset &&
      selectedFixtureId
    ) {
      sendFixtureId(selectedFixtureId);
      resetInitTaskState();
    }
  }, [initTaskState]);

  useEffect(() => {
    if (getFixtureInfoFlag) {
      sendFixtureInfo(fixtureInfo);
      setGetFixtureInfoFlag(false);
    }
  }, [getFixtureInfoFlag]);

  useEffect(() => {
    sendLiveStatus(fixtureLiveStatus);
  }, [fixtureLiveStatus]);

  useEffect(() => {
    sendLineup(fixtureLineup);
  }, [fixtureLineup]);

  useEffect(() => {
    sendEvents(fixtureEvents);
  }, [fixtureEvents]);

  useEffect(() => {
    window.electron.ipcRenderer.on('to-app', handleMessage);
  }, []);

  return <></>;
};

export default MatchliveIpc;
