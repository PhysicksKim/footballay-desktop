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

const isFetchStopStatus = (status: string) => {
  return END_STATUS.includes(status);
};

export const startFetchLineup = (fixtureId: number, preferenceKey: string) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchLineup = async () => {
      try {
        console.log(`lineup fetch start ${new Date().toLocaleTimeString()}`);
        const response = await dispatch(
          fetchFixtureLineup({ fixtureId, preferenceKey }),
        )?.unwrap();
        if (
          response &&
          response.lineup !== null &&
          isCompleteLineupData(response)
        ) {
          console.log(`response : `, response);
          console.log(
            `isCompleteLineupData(response) : ${isCompleteLineupData(response)}`,
          );
          clearInterval(intervalId);
          console.log(
            `lineup clear interval ${new Date().toLocaleTimeString()}`,
          );
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
        console.log(
          `liveStatus fetch start ${new Date().toLocaleTimeString()}`,
        );
        const response = await dispatch(
          fetchFixtureLiveStatus(fixtureId),
        ).unwrap();
        if (isFetchStopStatus(response.liveStatus.shortStatus)) {
          clearInterval(intervalId);
          console.log(
            `live status clear interval ${new Date().toLocaleTimeString()}`,
          );
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
        console.log(`event fetch start ${new Date().toLocaleTimeString()}`);
        await dispatch(fetchFixtureEvents(fixtureId)).unwrap();
        const nowStatus =
          getState().fixtureLive.liveStatus?.liveStatus.shortStatus;
        if (nowStatus && isFetchStopStatus(nowStatus)) {
          clearInterval(intervalId);
          console.log(
            `events clear interval ${new Date().toLocaleTimeString()}`,
          );
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
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
        console.log(
          `statistics fetch start ${new Date().toLocaleTimeString()}`,
        );
        await dispatch(fetchFixtureStatistics(fixtureId)).unwrap();
        const nowStatus =
          getState().fixtureLive?.liveStatus?.liveStatus?.shortStatus;
        if (nowStatus && isFetchStopStatus(nowStatus)) {
          clearInterval(intervalId);
          console.log(
            `statistics clear interval ${new Date().toLocaleTimeString()}`,
          );
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
