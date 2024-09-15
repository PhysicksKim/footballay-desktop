import { RootState } from '@app/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearFixtureLive,
  resetInitTaskState,
  setMatchliveWindowReady,
} from '../../store/slices/fixtureLiveSlice';
import {
  FixtureEvent,
  FixtureEventState,
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
  | 'GET_FIXTURE_EVENTS'
  | 'GET_PROCESSED_LINEUP';

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

export const getFilteredEvents = (
  fixtureEvents: FixtureEventState,
  filterEvents: FixtureEvent[],
): FixtureEventState => {
  const fixtureId = fixtureEvents.fixtureId;

  const filteredEvents: FixtureEvent[] = fixtureEvents.events.filter(
    (event) => {
      for (let i = 0; i < filterEvents.length; i++) {
        const filterEvent = filterEvents[i];
        if (
          event.sequence === filterEvent.sequence &&
          event.type === filterEvent.type &&
          event.elapsed === filterEvent.elapsed &&
          event.extraTime === filterEvent.extraTime &&
          event.team.teamId === filterEvent.team.teamId &&
          event.player.playerId === filterEvent.player.playerId
        ) {
          return false;
        }
      }
      return true;
    },
  );

  return {
    ...fixtureEvents,
    fixtureId: fixtureId,
    events: filteredEvents,
  };
};

const sendEvents = (
  fixtureEvents: FixtureEventState | null,
  filterList: FixtureEvent[] = [],
) => {
  if (!fixtureEvents) {
    window.electron.ipcRenderer.send('to-matchlive', {
      type: 'SET_EVENTS',
      data: fixtureEvents,
    });
    return;
  }
  const filteredEvents = getFilteredEvents(fixtureEvents, filterList);
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_EVENTS',
    data: filteredEvents,
  });
};

const sendShowPhoto = (_showPhoto: boolean) => {
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_SHOW_PHOTO',
    data: _showPhoto,
  });
};

const sendProcessedLineup = (processedLineup: any) => {
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_PROCESSED_LINEUP',
    data: processedLineup,
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
  const filterEvents = useSelector(
    (state: RootState) => state.fixtureLiveControl.filterEvents,
  );
  const processedLineup = useSelector(
    (state: RootState) => state.fixtureProcessedData.lineup,
  );

  const showPhoto = useSelector(
    (state: RootState) => state.fixtureLiveOption.showPhoto,
  );
  const showPhotoRef = useRef(showPhoto);

  const initTaskState = useSelector(
    (state: RootState) => state.fixtureLive.taskState.init,
  );
  const fixtureLive = useSelector((state: RootState) => state.fixtureLive);

  const [getFixtureInfoFlag, setGetFixtureInfoFlag] = useState(false);
  const [getFixtureLiveStatusFlag, setGetFixtureLiveStatusFlag] =
    useState(false);
  const [getFixtureLineupFlag, setGetFixtureLineupFlag] = useState(false);
  const [getFixtureEventsFlag, setGetFixtureEventsFlag] = useState(false);
  const [getProcessedLineupFlag, setGetProcessedLineupFlag] = useState(false);

  const handleMessage = (...args: IpcMessage[]) => {
    const { type, data } = args[0];
    switch (type) {
      case 'SEND_SHOW_PHOTO':
        console.log(
          'ipc request SEND_SHOW_PHOTO received. nowShowPhoto : ',
          showPhotoRef.current,
        );

        sendShowPhoto(showPhotoRef.current);
        break;
      case 'MATCHLIVE_WINDOW_READY':
        dispatch(setMatchliveWindowReady(true));
        break;
      case 'MATCHLIVE_WINDOW_CLOSED':
        dispatch(clearFixtureLive());
        dispatch(setMatchliveWindowReady(false));
        break;
      case 'GET_FIXTURE_INFO':
        setGetFixtureInfoFlag(true);
        break;
      case 'GET_FIXTURE_LIVE_STATUS':
        setGetFixtureLiveStatusFlag(true);
        break;
      case 'GET_FIXTURE_LINEUP':
        setGetFixtureLineupFlag(true);
        break;
      case 'GET_PROCESSED_LINEUP':
        setGetProcessedLineupFlag(true);
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
      sendEvents(fixtureEvents, filterEvents);
      setGetFixtureEventsFlag(false);
    }
  }, [getFixtureEventsFlag]);

  useEffect(() => {
    if (getProcessedLineupFlag) {
      sendProcessedLineup(processedLineup);
      setGetProcessedLineupFlag(false);
    }
  }, [getProcessedLineupFlag]);

  useEffect(() => {
    sendLiveStatus(fixtureLiveStatus);
  }, [fixtureLiveStatus]);

  useEffect(() => {
    sendLineup(fixtureLineup);
  }, [fixtureLineup]);

  useEffect(() => {
    sendProcessedLineup(processedLineup);
  }, [processedLineup]);

  useEffect(() => {
    sendEvents(fixtureEvents, filterEvents);
  }, [fixtureEvents, filterEvents]);

  useEffect(() => {
    showPhotoRef.current = showPhoto;
    sendShowPhoto(showPhoto);
  }, [showPhoto]);

  useEffect(() => {
    window.electron.ipcRenderer.on('to-app', handleMessage);
  }, []);

  return <></>;
};

export default MatchliveIpc;
