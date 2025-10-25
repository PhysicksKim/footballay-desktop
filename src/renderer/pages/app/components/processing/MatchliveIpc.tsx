import { RootState } from '@app/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearFixtureLive,
  resetInitTaskState,
  setMatchliveWindowReady,
} from '../../store/slices/live/fixtureLiveSlice';
import {
  FixtureEvent,
  FixtureEventState,
  FixtureInfo,
  FixtureLineup,
  FixtureLiveStatus,
  FixtureStatistics,
} from '@src/types/FixtureIpc';
import { setMatchliveAlwaysOnTop } from '../../store/slices/states/WindowInfoSlice';

export type ReceiveIpcType =
  | 'SEND_SHOW_PHOTO'
  | 'MATCHLIVE_WINDOW_READY'
  | 'MATCHLIVE_WINDOW_CLOSED'
  | 'GET_FIXTURE_INFO'
  | 'GET_FIXTURE_LIVE_STATUS'
  | 'GET_FIXTURE_LINEUP'
  | 'GET_FIXTURE_EVENTS'
  | 'GET_PROCESSED_LINEUP'
  | 'GET_FIXTURE_STATISTICS'
  | 'AUTO_UPDATER_WINDOW_CLOSED'
  | 'MATCHLIVE_REACT_READY'
  | 'get:always-on-top';

export interface IpcMessage {
  type: ReceiveIpcType;
  data?: any;
}

const sendFixtureId = (selectedFixtureId: number) => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:ipc',
      msg: 'send:SET_FIXTURE_ID',
      data: { fixtureId: selectedFixtureId },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_FIXTURE_ID',
    data: selectedFixtureId,
  });
};

const sendFixtureInfo = (fixtureInfo: FixtureInfo | null) => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:ipc',
      msg: 'send:SET_FIXTURE_INFO',
      data: { has: !!fixtureInfo },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_FIXTURE_INFO',
    data: fixtureInfo,
  });
};

const sendLiveStatus = (fixtureLiveStatus: FixtureLiveStatus | null) => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:ipc',
      msg: 'send:SET_LIVE_STATUS',
      data: {
        has: !!fixtureLiveStatus,
        shortStatus: fixtureLiveStatus?.liveStatus?.shortStatus,
      },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_LIVE_STATUS',
    data: fixtureLiveStatus,
  });
};

const sendLineup = (fixtureLineup: FixtureLineup | null) => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:ipc',
      msg: 'send:SET_LINEUP',
      data: { has: !!fixtureLineup },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_LINEUP',
    data: fixtureLineup,
  });
};

const sendStatistics = (fixtureStatistics: FixtureStatistics | null) => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:ipc',
      msg: 'send:SET_STATISTICS',
      data: { has: !!fixtureStatistics },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_STATISTICS',
    data: fixtureStatistics,
  });
};

export const getFilteredEvents = (
  fixtureEvents: FixtureEventState,
  filterEvents: FixtureEvent[]
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
          event.player?.playerId === filterEvent.player?.playerId
        ) {
          return false;
        }
      }
      return true;
    }
  );

  return {
    ...fixtureEvents,
    fixtureId: fixtureId,
    events: filteredEvents,
  };
};

const sendEvents = (
  fixtureEvents: FixtureEventState | null,
  filterList: FixtureEvent[] = []
) => {
  if (!fixtureEvents) {
    try {
      (window as any)?.electron?.ipcRenderer?.send('loginfo', {
        where: 'app:ipc',
        msg: 'send:SET_EVENTS',
        data: { has: false },
      });
    } catch (e) {
      void e;
    }
    window.electron.ipcRenderer.send('to-matchlive', {
      type: 'SET_EVENTS',
      data: fixtureEvents,
    });
    return;
  }
  const filteredEvents = getFilteredEvents(fixtureEvents, filterList);
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:ipc',
      msg: 'send:SET_EVENTS',
      data: {
        has: true,
        before: fixtureEvents?.events?.length,
        after: filteredEvents?.events?.length,
      },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_EVENTS',
    data: filteredEvents,
  });
};

const sendProcessedLineup = (processedLineup: any) => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:ipc',
      msg: 'send:SET_PROCESSED_LINEUP',
      data: { has: !!processedLineup },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-matchlive', {
    type: 'SET_PROCESSED_LINEUP',
    data: processedLineup,
  });
};

/**
 * <pre>
 * Matchlive window 에게 ipc 로 데이터들을 제공해 줍니다.
 * 2가지 경우에 따라 ipc 로 데이터가 전송됩니다.
 * 1) 요청시 : matchlive window 에서 ipc 로 GET 요청을 보낸 경우
 * 2) 변경시 : app window 에서 반복 fetch 결과로 데이터가 변경됨을 감지한 경우
 * 요청시 데이터 전송은 `handleMessage()` 를 통해 ipc 수신 시에 동작하도록 처리됩니다.
 * handleMessage() 는 데이터 요청 ipc를 받을 시 flag 를 true 로 변경하고,
 * useEffect 에서 flag 변화를 감지하여 데이터를 전송하도록 합니다.
 * 변경시 데이터 전송은 useEffect 를 이용해 해당 데이터의 redux state 변경을 감지해 전송하도록 합니다.
 * </pre>
 * @returns
 */
const MatchliveIpc = () => {
  const dispatch = useDispatch();

  const selectedFixtureId = useSelector(
    (state: RootState) => state.fixtureLive.fixtureId
  );
  const fixtureInfo = useSelector((state: RootState) => state.fixtureLive.info);
  const fixtureLiveStatus = useSelector(
    (state: RootState) => state.fixtureLive.liveStatus
  );
  const fixtureLineup = useSelector(
    (state: RootState) => state.fixtureLive.lineup
  );
  const fixtureEvents = useSelector(
    (state: RootState) => state.fixtureLive.events
  );
  const fixtureStatistics = useSelector(
    (state: RootState) => state.fixtureLive.statistics
  );
  const filterEvents = useSelector(
    (state: RootState) => state.fixtureLiveControl.filterEvents
  );
  const processedLineup = useSelector(
    (state: RootState) => state.fixtureProcessedData.lineup
  );
  const showPhoto = useSelector(
    (state: RootState) => state.fixtureLiveOption.showPhoto
  );
  const showPhotoRef = useRef(showPhoto);

  const initTaskState = useSelector(
    (state: RootState) => state.fixtureLive.taskState.init
  );
  const fixtureLive = useSelector((state: RootState) => state.fixtureLive);

  const [getFixtureInfoFlag, setGetFixtureInfoFlag] = useState(false);
  const [getFixtureLiveStatusFlag, setGetFixtureLiveStatusFlag] =
    useState(false);
  const [getFixtureLineupFlag, setGetFixtureLineupFlag] = useState(false);
  const [getFixtureEventsFlag, setGetFixtureEventsFlag] = useState(false);
  const [getProcessedLineupFlag, setGetProcessedLineupFlag] = useState(false);
  const [getFixtureStatisticsFlag, setGetFixtureStatisticsFlag] =
    useState(false);

  const handleToAppMessage = (...args: IpcMessage[]) => {
    const { type } = args[0];
    switch (type) {
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
      case 'GET_FIXTURE_STATISTICS':
        setGetFixtureStatisticsFlag(true);
        break;
      case 'AUTO_UPDATER_WINDOW_CLOSED':
        break;
      case 'MATCHLIVE_REACT_READY':
        break;
      default:
        console.error('unexpected IPC message type :', type);
    }
  };

  const handleWindowControlResponseMessage = (...args: IpcMessage[]) => {
    const { type, data } = args[0];
    switch (type) {
      case 'get:always-on-top':
        const isAlwaysOnTop = data;
        dispatch(setMatchliveAlwaysOnTop(isAlwaysOnTop));
        break;
      default:
        console.error('unexpected IPC message type :', type);
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('to-app', handleToAppMessage);
    window.electron.ipcRenderer.on(
      'window-control-response',
      handleWindowControlResponseMessage
    );
  }, []);

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
    if (getFixtureStatisticsFlag) {
      sendStatistics(fixtureStatistics);
      setGetFixtureStatisticsFlag(false);
    }
  }, [getFixtureStatisticsFlag]);

  useEffect(() => {
    if (getProcessedLineupFlag) {
      sendProcessedLineup(processedLineup);
      setGetProcessedLineupFlag(false);
    }
  }, [getProcessedLineupFlag]);

  useEffect(() => {
    sendFixtureInfo(fixtureInfo);
  }, [fixtureInfo]);

  useEffect(() => {
    sendLiveStatus(fixtureLiveStatus);
  }, [fixtureLiveStatus]);

  useEffect(() => {
    sendLineup(fixtureLineup);
  }, [fixtureLineup]);

  useEffect(() => {
    sendStatistics(fixtureStatistics);
  }, [fixtureStatistics]);

  useEffect(() => {
    sendProcessedLineup(processedLineup);
  }, [processedLineup]);

  useEffect(() => {
    sendEvents(fixtureEvents, filterEvents);
  }, [fixtureEvents, filterEvents]);

  return <></>;
};

export default MatchliveIpc;
