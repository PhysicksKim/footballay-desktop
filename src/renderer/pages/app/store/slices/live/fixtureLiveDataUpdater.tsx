import { AppDispatch, RootState } from '@app/store/store';
import {
  fetchFixtureLineup,
  fetchFixtureEvents,
  fetchFixtureLiveStatus,
  fetchFixtureStatistics,
} from '@app/store/slices/live/fixtureLiveSliceThunk';
import { addIntervalId, removeIntervalId } from './fixtureLiveSlice';
import { isCompleteLineupData } from './LineupValidator';

const LINEUP_INTERVAL_TIME = 30000;
const LIVE_DATA_INTERVAL_TIME = 13000;
const END_STATUS = ['FT', 'AET', 'PEN', 'CANC', 'ABD', 'AWD', 'WO'];
const _DEBUG_CONSOLE_PRINT = false;

const shouldStopFetch = (status: string) => {
  return END_STATUS.includes(status);
};

export const startFetchLineup = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchLineup = async () => {
      try {
        const response = await dispatch(
          fetchFixtureLineup(fixtureId),
        )?.unwrap();
        if (
          response &&
          response.lineup !== null &&
          isCompleteLineupData(response)
        ) {
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch lineup:', error);
      }
    };
    const intervalId: NodeJS.Timeout = setInterval(
      fetchLineup,
      LINEUP_INTERVAL_TIME,
    );
    dispatch(addIntervalId(intervalId));
    fetchLineup();
  };
};

export const startFetchLiveStatus = (fixtureId: number) => {
  return (dispatch: AppDispatch) => {
    const fetchLiveStatus = async () => {
      try {
        const response = await dispatch(
          fetchFixtureLiveStatus(fixtureId),
        ).unwrap();
        if (shouldStopFetch(response.liveStatus.shortStatus)) {
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch live status:', error);
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
        await dispatch(fetchFixtureEvents(fixtureId)).unwrap();
        const nowStatus =
          getState().fixtureLive.liveStatus?.liveStatus.shortStatus;
        if (nowStatus && shouldStopFetch(nowStatus)) {
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    const intervalId = setInterval(fetchEvents, LIVE_DATA_INTERVAL_TIME);
    dispatch(addIntervalId(intervalId));
    fetchEvents();
  };
};

export const startFetchStatistics = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchStatistics = async () => {
      try {
        await dispatch(fetchFixtureStatistics(fixtureId)).unwrap();
        const nowStatus =
          getState().fixtureLive?.liveStatus?.liveStatus?.shortStatus;
        if (nowStatus && shouldStopFetch(nowStatus)) {
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };
    const intervalId = setInterval(fetchStatistics, LIVE_DATA_INTERVAL_TIME);
    dispatch(addIntervalId(intervalId));
    fetchStatistics();
  };
};
