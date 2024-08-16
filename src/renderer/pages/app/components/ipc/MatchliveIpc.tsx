import { RootState } from '@app/store/store';
import { ar } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWaitFixtureInfo } from '@app/store/slices/ipc/ipcStatusSlice';
import { fetchFixtureInfo } from '../../store/slices/fixtureLiveSliceThunk';
import {
  clearFixtureLive,
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
  | 'SEND_SHOW_PHOTO'
  | 'MATCHLIVE_WINDOW_READY'
  | 'MATCHLIVE_WINDOW_CLOSED'
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
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_FIXTURE_ID',
    data: selectedFixtureId,
  });
};

const sendFixtureInfo = (fixtureInfo: FixtureInfo | null) => {
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_FIXTURE_INFO',
    data: fixtureInfo,
  });
};

const sendLiveStatus = (fixtureLiveStatus: FixtureLiveStatus | null) => {
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_LIVE_STATUS',
    data: fixtureLiveStatus,
  });
};

const sendLineup = (fixtureLineup: FixtureLineup | null) => {
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_LINEUP',
    data: fixtureLineup,
  });
};

const sendEvents = (fixtureEvents: FixtureEventResponse | null) => {
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_EVENTS',
    data: fixtureEvents,
  });
};

const sendShowPhoto = (showPhoto: boolean) => {
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_SHOW_PHOTO',
    data: showPhoto,
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

  const showPhoto = useSelector(
    (state: RootState) => state.fixtureLiveOption.showPhoto,
  );

  const initTaskState = useSelector(
    (state: RootState) => state.fixtureLive.taskState.init,
  );
  const fixtureLive = useSelector((state: RootState) => state.fixtureLive);

  const [getFixtureInfoFlag, setGetFixtureInfoFlag] = useState(false);
  const [getFixtureLiveStatusFlag, setGetFixtureLiveStatusFlag] =
    useState(false);
  const [getFixtureLineupFlag, setGetFixtureLineupFlag] = useState(false);
  const [getFixtureEventsFlag, setGetFixtureEventsFlag] = useState(false);

  const handleMessage = (...args: IpcMessage[]) => {
    const { type, data } = args[0];
    switch (type) {
      case 'SEND_SHOW_PHOTO':
        sendShowPhoto(showPhoto);
        break;
      case 'MATCHLIVE_WINDOW_READY':
        dispatch(setMatchliveWindowReady(true));
        break;
      case 'MATCHLIVE_WINDOW_CLOSED':
        dispatch(clearFixtureLive());
        dispatch(setMatchliveWindowReady(false));
      case 'GET_FIXTURE_INFO':
        setGetFixtureInfoFlag(true);
        break;
      case 'GET_FIXTURE_LIVE_STATUS':
        setGetFixtureLiveStatusFlag(true);
        break;
      case 'GET_FIXTURE_LINEUP':
        setGetFixtureLineupFlag(true);
        break;
      case 'GET_FIXTURE_EVENTS':
        setGetFixtureEventsFlag(true);
        break;
      default:
        console.log('unexpected IPC message type :', type);
    }
  };

  useEffect(() => {
    if (
      initTaskState.matchliveWindowReady &&
      initTaskState.fixtureIdUpdated &&
      initTaskState.fixtureLiveStateReset &&
      selectedFixtureId
    ) {
      sendFixtureId(selectedFixtureId);
      dispatch(resetInitTaskState());
    }
  }, [initTaskState]);

  useEffect(() => {
    if (getFixtureInfoFlag) {
      sendFixtureInfo(fixtureInfo);
      setGetFixtureInfoFlag(false);
    }
  }, [getFixtureInfoFlag]);

  useEffect(() => {
    if (getFixtureLiveStatusFlag) {
      sendLiveStatus(fixtureLiveStatus);
      setGetFixtureLiveStatusFlag(false);
    }
  }, [getFixtureLiveStatusFlag]);

  useEffect(() => {
    if (getFixtureLineupFlag) {
      sendLineup(fixtureLineup);
      setGetFixtureLineupFlag(false);
    }
  }, [getFixtureLineupFlag]);

  useEffect(() => {
    if (getFixtureEventsFlag) {
      sendEvents(fixtureEvents);
      setGetFixtureEventsFlag(false);
    }
  }, [getFixtureEventsFlag]);

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
    sendShowPhoto(showPhoto);
  }, [showPhoto]);

  useEffect(() => {
    window.electron.ipcRenderer.on('to-app', handleMessage);
  }, []);

  return <></>;
};

export default MatchliveIpc;
