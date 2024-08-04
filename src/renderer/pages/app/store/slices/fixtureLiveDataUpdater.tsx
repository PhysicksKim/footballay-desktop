import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchFixtureLineup,
  fetchFixtureEvents,
  fetchFixtureLiveStatus,
} from './fixtureLiveSliceThunk';

const intervalTime = 1000; // 30초마다 fetch

const END_STATUS = ['FT', 'AET', 'PEN', 'CANC', 'ABD', 'AWD', 'WO'];
const shouldStopFetch = (status: string) => {
  return END_STATUS.includes(status);
};

export const startFetchLineup = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const intervalId = setInterval(async () => {
      try {
        console.log('lineup fetch interval id : ', intervalId);
        const response = await dispatch(fetchFixtureLineup(fixtureId)).unwrap();
        if (response && response.lineup !== null) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Failed to fetch lineup:', error);
      }
    }, intervalTime);
  };
};

export const startFetchLiveStatus = (fixtureId: number) => {
  return (dispatch: AppDispatch) => {
    const intervalId = setInterval(async () => {
      try {
        console.log('liveStatus fetch interval id : ', intervalId);
        const response = await dispatch(
          fetchFixtureLiveStatus(fixtureId),
        ).unwrap();
        if (shouldStopFetch(response.shortStatus)) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Failed to fetch live status:', error);
      }
    }, intervalTime);
  };
};

export const startFetchEvents = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const intervalId = setInterval(async () => {
      try {
        console.log('Events fetch interval id : ', intervalId);
        await dispatch(fetchFixtureEvents(fixtureId)).unwrap();
        const nowStatus = getState().fixture.liveStatus?.shortStatus;
        if (nowStatus && shouldStopFetch(nowStatus)) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }, intervalTime);
  };
};
