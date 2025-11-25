import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFixtureEvents,
  setFixtureId,
  setFixtureInfo,
  setFixtureLineup,
  setFixtureLiveStatus,
  setFixtureStatistics,
} from '@matchlive/store/slices/fixtureSlice';
import { setProcessedLineup } from '@matchlive/store/slices/fixtureProcessedDataSlice';
import { RootState } from '@matchlive/store/store';
import { setShowPhoto } from '@matchlive/store/slices/fixtureLiveOptionSlice';
import { selectIsV1Mode } from '@matchlive/store/slices/v1FixtureSlice';

export type ReceiveIpcType =
  | 'SET_FIXTURE_ID'
  | 'SET_FIXTURE_INFO'
  | 'SET_LIVE_STATUS'
  | 'SET_LINEUP'
  | 'SET_EVENTS'
  | 'SET_STATISTICS'
  | 'SET_PROCESSED_LINEUP';
export type SendIpcType =
  | 'GET_FIXTURE_ID'
  | 'GET_FIXTURE_INFO'
  | 'GET_FIXTURE_LIVE_STATUS'
  | 'GET_FIXTURE_LINEUP'
  | 'GET_FIXTURE_EVENTS'
  | 'GET_FIXTURE_STATISTICS'
  | 'GET_PROCESSED_LINEUP'
  | 'MATCHLIVE_REACT_READY'
  | 'SEND_SHOW_PHOTO';
export interface IpcMessage {
  type: ReceiveIpcType;
  data?: any;
}

const sendToApp = (type: SendIpcType, data?: any) => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'matchlive:ipc',
      msg: 'sendToApp',
      data: { type },
    });
  } catch (e) {
    void e;
  }
  window.electron.ipcRenderer.send('to-app', { type, data });
};

const requestFixtureInitialLiveData = () => {
  try {
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'matchlive:ipc',
      msg: 'requestFixtureInitialLiveData',
    });
  } catch (e) {
    void e;
  }
  sendToApp('GET_FIXTURE_LIVE_STATUS');
  sendToApp('GET_FIXTURE_LINEUP');
  sendToApp('GET_PROCESSED_LINEUP');
  sendToApp('GET_FIXTURE_EVENTS');
  sendToApp('GET_FIXTURE_STATISTICS');
};

const FixtureIpc = () => {
  const dispatch = useDispatch();
  const fixtureId = useSelector((state: RootState) => state.fixture.fixtureId);
  const fixtureInfo = useSelector((state: RootState) => state.fixture.info);
  const isV1Mode = useSelector((state: RootState) => selectIsV1Mode(state));

  // Timeout 관리를 위한 ref
  const fixtureInfoRetryTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRY_COUNT = 10; // 최대 10회 재시도 (10초)

  useEffect(() => {
    // V1 모드가 아닐 때만 레거시 IPC 활성화
    if (!isV1Mode) {
      sendMatchliveReactReady();
    }

    // Cleanup: 컴포넌트 언마운트 시 모든 timeout 정리
    return () => {
      if (fixtureInfoRetryTimeoutRef.current) {
        clearTimeout(fixtureInfoRetryTimeoutRef.current);
        fixtureInfoRetryTimeoutRef.current = null;
      }
    };
  }, [isV1Mode]);

  const handleMessage = (...args: IpcMessage[]) => {
    // V1 모드일 때는 레거시 IPC 메시지 무시
    if (isV1Mode) {
      return;
    }

    const { type, data } = args[0];
    try {
      (window as any)?.electron?.ipcRenderer?.send('loginfo', {
        where: 'matchlive:ipc',
        msg: 'recv:to-matchlive',
        data: { type },
      });
    } catch (e) {
      void e;
    }

    switch (type) {
      case 'SET_FIXTURE_ID': {
        dispatch(setFixtureId(data));
        break;
      }
      case 'SET_FIXTURE_INFO': {
        if (!data) {
          // 최대 재시도 횟수 체크
          if (retryCountRef.current < MAX_RETRY_COUNT) {
            retryCountRef.current += 1;

            // 이전 timeout 정리
            if (fixtureInfoRetryTimeoutRef.current) {
              clearTimeout(fixtureInfoRetryTimeoutRef.current);
            }

            // 재시도 (지수 백오프: 1초, 2초, 4초... 최대 5초)
            const retryDelay = Math.min(
              1000 * Math.pow(2, retryCountRef.current - 1),
              5000
            );
            fixtureInfoRetryTimeoutRef.current = setTimeout(() => {
              sendFixtureInfoRequest();
            }, retryDelay);
          } else {
            // 최대 재시도 초과 시 로그만 남기고 중단
            console.warn(
              '[FixtureIpc] Max retry count reached for fixture info request'
            );
          }
        } else {
          // 데이터 수신 성공 시 재시도 카운트 리셋
          retryCountRef.current = 0;
          if (fixtureInfoRetryTimeoutRef.current) {
            clearTimeout(fixtureInfoRetryTimeoutRef.current);
            fixtureInfoRetryTimeoutRef.current = null;
          }

          dispatch(setFixtureInfo(data));
          requestFixtureInitialLiveData();
        }
        break;
      }
      case 'SET_LIVE_STATUS': {
        try {
          (window as any)?.electron?.ipcRenderer?.send('loginfo', {
            where: 'matchlive:ipc',
            msg: 'apply:SET_LIVE_STATUS',
            data: {
              has: !!data,
              shortStatus: data?.liveStatus?.shortStatus,
              elapsed: data?.liveStatus?.elapsed,
            },
          });
        } catch (e) {
          void e;
        }
        dispatch(setFixtureLiveStatus(data));
        break;
      }
      case 'SET_LINEUP': {
        try {
          (window as any)?.electron?.ipcRenderer?.send('loginfo', {
            where: 'matchlive:ipc',
            msg: 'apply:SET_LINEUP',
            data: {
              has: !!data,
              homePlayers: data?.lineup?.home?.players?.length,
              awayPlayers: data?.lineup?.away?.players?.length,
            },
          });
        } catch (e) {
          void e;
        }
        dispatch(setFixtureLineup(data));
        break;
      }
      case 'SET_EVENTS': {
        try {
          (window as any)?.electron?.ipcRenderer?.send('loginfo', {
            where: 'matchlive:ipc',
            msg: 'apply:SET_EVENTS',
            data: { total: data?.events?.length },
          });
        } catch (e) {
          void e;
        }
        dispatch(setFixtureEvents(data));
        break;
      }
      case 'SET_PROCESSED_LINEUP': {
        try {
          (window as any)?.electron?.ipcRenderer?.send('loginfo', {
            where: 'matchlive:ipc',
            msg: 'apply:SET_PROCESSED_LINEUP',
            data: { has: !!data },
          });
        } catch (e) {
          void e;
        }
        dispatch(setProcessedLineup(data));
        break;
      }
      case 'SET_STATISTICS': {
        try {
          (window as any)?.electron?.ipcRenderer?.send('loginfo', {
            where: 'matchlive:ipc',
            msg: 'apply:SET_STATISTICS',
            data: {
              has: !!data,
              homeCount: data?.home?.playerStatistics?.length,
              awayCount: data?.away?.playerStatistics?.length,
            },
          });
        } catch (e) {
          void e;
        }
        dispatch(setFixtureStatistics(data));
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    // V1 모드일 때는 레거시 fixture info 요청 안 함
    if (isV1Mode) {
      return;
    }

    // fixtureId 변경 시 재시도 카운트 리셋 및 기존 timeout 정리
    retryCountRef.current = 0;
    if (fixtureInfoRetryTimeoutRef.current) {
      clearTimeout(fixtureInfoRetryTimeoutRef.current);
      fixtureInfoRetryTimeoutRef.current = null;
    }

    sendFixtureInfoRequest();
  }, [fixtureId, isV1Mode]);

  const sendFixtureInfoRequest = () => {
    sendToApp('GET_FIXTURE_INFO');
  };

  const sendMatchliveReactReady = () => {
    sendToApp('MATCHLIVE_REACT_READY');
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
