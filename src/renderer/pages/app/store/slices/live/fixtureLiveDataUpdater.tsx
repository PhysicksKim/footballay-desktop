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

import { getLogger } from '@app/utils/logger';

const log = getLogger('app:polling');

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
        log.info('fetchLineup:start', { fixtureId });
        const response = await dispatch(
          fetchFixtureLineup({ fixtureId })
        )?.unwrap();
        log.info('fetchLineup:response', {
          fixtureId,
          hasLineup: !!response?.lineup,
        });
        if (
          response &&
          response.lineup !== null &&
          isCompleteLineupData(response)
        ) {
          log.info('fetchLineup:completeLineupDetected:stopPolling', {
            fixtureId,
          });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch lineup:', error);
        log.error('fetchLineup:error', { fixtureId, error: String(error) });
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
        log.info('fetchLiveStatus:start', { fixtureId });
        const response = await dispatch(
          fetchFixtureLiveStatus(fixtureId)
        ).unwrap();
        log.info('fetchLiveStatus:response', {
          fixtureId,
          shortStatus: response?.liveStatus?.shortStatus,
        });
        if (isFetchStopStatus(response.liveStatus.shortStatus)) {
          log.info('fetchLiveStatus:stopPolling', {
            fixtureId,
            shortStatus: response?.liveStatus?.shortStatus,
          });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch live status:', error);
        log.error('fetchLiveStatus:error', { fixtureId, error: String(error) });
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
        log.info('fetchEvents:start', { fixtureId });
        const resp = await dispatch(fetchFixtureEvents(fixtureId)).unwrap();
        log.info('fetchEvents:response', {
          fixtureId,
          total: resp?.events?.length,
        });
        const nowStatus =
          getState().fixtureLive.liveStatus?.liveStatus.shortStatus;
        if (nowStatus && isFetchStopStatus(nowStatus)) {
          log.info('fetchEvents:stopPollingByStatus', { fixtureId, nowStatus });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        log.error('fetchEvents:error', { fixtureId, error: String(error) });
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
        log.info('fetchStatistics:start', { fixtureId });
        const resp = await dispatch(fetchFixtureStatistics(fixtureId)).unwrap();
        log.info('fetchStatistics:response', {
          fixtureId,
          homeCount: resp?.home?.playerStatistics?.length,
          awayCount: resp?.away?.playerStatistics?.length,
        });
        const nowStatus =
          getState().fixtureLive?.liveStatus?.liveStatus?.shortStatus;
        if (nowStatus && isFetchStopStatus(nowStatus)) {
          log.info('fetchStatistics:stopPollingByStatus', {
            fixtureId,
            nowStatus,
          });
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        log.error('fetchStatistics:error', { fixtureId, error: String(error) });
      }
    };
    const intervalId = setInterval(fetchStatistics, LIVE_DATA_INTERVAL_TIME);
    dispatch(addIntervalId(intervalId));
    fetchStatistics();
  };
};
