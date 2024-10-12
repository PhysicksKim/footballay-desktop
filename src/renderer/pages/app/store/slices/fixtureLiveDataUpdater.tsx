import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchFixtureLineup,
  fetchFixtureEvents,
  fetchFixtureLiveStatus,
  fetchFixtureStatistics,
} from './fixtureLiveSliceThunk';
import { addIntervalId, removeIntervalId } from './fixtureLiveSlice';

const intervalTime = 13000;

const END_STATUS = ['FT', 'AET', 'PEN', 'CANC', 'ABD', 'AWD', 'WO'];
const shouldStopFetch = (status: string) => {
  return END_STATUS.includes(status);
};

const _DEBUG_CONSOLE_PRINT = false;

export const startFetchLineup = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchLineup = async () => {
      try {
        const response = await dispatch(fetchFixtureLineup(fixtureId)).unwrap();
        if (response && response.lineup !== null) {
          clearInterval(intervalId);
          dispatch(removeIntervalId(intervalId));
        }
      } catch (error) {
        console.error('Failed to fetch lineup:', error);
      }
    };
    const intervalId: NodeJS.Timeout = setInterval(fetchLineup, intervalTime);
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
    const intervalId = setInterval(fetchLiveStatus, intervalTime);
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
    const intervalId = setInterval(fetchEvents, intervalTime);
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
    const intervalId = setInterval(fetchStatistics, intervalTime);
    dispatch(addIntervalId(intervalId));
    fetchStatistics();
  };
};
