import { AppDispatch, RootState } from '@app/store/store';
import {
  fetchFixtureLineup,
  fetchFixtureEvents,
  fetchFixtureLiveStatus,
  fetchFixtureStatistics,
} from '@app/store/slices/live/fixtureLiveSliceThunk';
import {
  addIntervalId,
  removeEvents,
  removeIntervalId,
} from './fixtureLiveSlice';
import { isCompleteLineupData } from './LineupValidator';

const LINEUP_INTERVAL_TIME = 17000;
const LIVE_DATA_INTERVAL_TIME = 11000;
const END_STATUS = ['FT', 'AET', 'PEN', 'CANC', 'ABD', 'AWD', 'WO'];
const _DEBUG_CONSOLE_PRINT = false;

const elog = (msg: string, data?: any) => {
  try {
    // renderer -> main
    // 로그 채널은 electron/main/ipcManager.ts 의 'loginfo' 핸들러에서 파일로 기록됨
    // where 로 구분: app:polling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)?.electron?.ipcRenderer?.send('loginfo', {
      where: 'app:polling',
      msg,
      data,
    });
  } catch (_) {
    // ignore
  }
};

const isFetchStopStatus = (status: string) => {
  return END_STATUS.includes(status);
};

export const startFetchLineup = (
  fixtureId: number,
  preferenceKey: string = ''
) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchLineup = async () => {
      try {
        if (_DEBUG_CONSOLE_PRINT) console.log('fetchLineup start', fixtureId);
        elog('fetchLineup:start', { fixtureId });
        const response = await dispatch(
          fetchFixtureLineup({ fixtureId })
        )?.unwrap();
        elog('fetchLineup:response', {
          fixtureId,
          hasLineup: !!response?.lineup,
        });
        if (
          response &&
          response.lineup !== null &&
          isCompleteLineupData(response)
        ) {
          elog('fetchLineup:completeLineupDetected:stopPolling', { fixtureId });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch lineup:', error);
        elog('fetchLineup:error', { fixtureId, error: String(error) });
      }
    };
    const intervalId: NodeJS.Timeout = setInterval(
      fetchLineup,
      LINEUP_INTERVAL_TIME
    );
    dispatch(addIntervalId(intervalId));
    fetchLineup();
  };
};

export const startFetchLiveStatus = (fixtureId: number) => {
  return (dispatch: AppDispatch) => {
    const fetchLiveStatus = async () => {
      try {
        elog('fetchLiveStatus:start', { fixtureId });
        const response = await dispatch(
          fetchFixtureLiveStatus(fixtureId)
        ).unwrap();
        elog('fetchLiveStatus:response', {
          fixtureId,
          shortStatus: response?.liveStatus?.shortStatus,
        });
        if (isFetchStopStatus(response.liveStatus.shortStatus)) {
          elog('fetchLiveStatus:stopPolling', {
            fixtureId,
            shortStatus: response?.liveStatus?.shortStatus,
          });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch live status:', error);
        elog('fetchLiveStatus:error', { fixtureId, error: String(error) });
      }
    };
    const intervalId = setInterval(fetchLiveStatus, LIVE_DATA_INTERVAL_TIME);
    dispatch(addIntervalId(intervalId));
    fetchLiveStatus();
  };
};

export const startFetchEvents = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchEvents = async () => {
      try {
        elog('fetchEvents:start', { fixtureId });
        const resp = await dispatch(fetchFixtureEvents(fixtureId)).unwrap();
        elog('fetchEvents:response', {
          fixtureId,
          total: resp?.events?.length,
        });
        const nowStatus =
          getState().fixtureLive.liveStatus?.liveStatus.shortStatus;
        if (nowStatus && isFetchStopStatus(nowStatus)) {
          elog('fetchEvents:stopPollingByStatus', { fixtureId, nowStatus });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        elog('fetchEvents:error', { fixtureId, error: String(error) });
      }
    };
    const intervalId = setInterval(fetchEvents, LIVE_DATA_INTERVAL_TIME);
    dispatch(addIntervalId(intervalId));
    dispatch(removeEvents());
    fetchEvents();
  };
};

export const startFetchStatistics = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchStatistics = async () => {
      try {
        elog('fetchStatistics:start', { fixtureId });
        const resp = await dispatch(fetchFixtureStatistics(fixtureId)).unwrap();
        elog('fetchStatistics:response', {
          fixtureId,
          homeCount: resp?.home?.playerStatistics?.length,
          awayCount: resp?.away?.playerStatistics?.length,
        });
        const nowStatus =
          getState().fixtureLive?.liveStatus?.liveStatus?.shortStatus;
        if (nowStatus && isFetchStopStatus(nowStatus)) {
          elog('fetchStatistics:stopPollingByStatus', { fixtureId, nowStatus });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        elog('fetchStatistics:error', { fixtureId, error: String(error) });
      }
    };
    const intervalId = setInterval(fetchStatistics, LIVE_DATA_INTERVAL_TIME);
    dispatch(addIntervalId(intervalId));
    fetchStatistics();
  };
};
