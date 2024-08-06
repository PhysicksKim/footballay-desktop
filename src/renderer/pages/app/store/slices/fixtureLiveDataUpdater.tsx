import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchFixtureLineup,
  fetchFixtureEvents,
  fetchFixtureLiveStatus,
} from './fixtureLiveSliceThunk';
import { addIntervalId, removeIntervalId } from './fixtureLiveSlice';

const intervalTime = 10000;

const END_STATUS = ['FT', 'AET', 'PEN', 'CANC', 'ABD', 'AWD', 'WO'];
const shouldStopFetch = (status: string) => {
  return END_STATUS.includes(status);
};

const _DEBUG_CONSOLE_PRINT = false;

export const startFetchLineup = (fixtureId: number) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const fetchLineup = async () => {
      try {
        if (_DEBUG_CONSOLE_PRINT)
          console.log('lineup fetch interval id : ', intervalId);
        const response = await dispatch(fetchFixtureLineup(fixtureId)).unwrap();
        if (response && response.lineup !== null) {
          if (_DEBUG_CONSOLE_PRINT)
            console.log('lineup fetch success. clear interval!');
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
        if (_DEBUG_CONSOLE_PRINT)
          console.log('liveStatus fetch interval id : ', intervalId);
        const response = await dispatch(
          fetchFixtureLiveStatus(fixtureId),
        ).unwrap();
        if (_DEBUG_CONSOLE_PRINT)
          console.log(
            `liveStatus fetch shortStatus=${response.liveStatus.shortStatus}
          shoudlStop=${shouldStopFetch(response.liveStatus.shortStatus)}
          / response:`,
            response,
          );
        if (shouldStopFetch(response.liveStatus.shortStatus)) {
          if (_DEBUG_CONSOLE_PRINT)
            console.log(
              'liveStatus fetched. interval will be cleared by match finish!',
            );
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
        if (_DEBUG_CONSOLE_PRINT)
          console.log('Events fetch interval id : ', intervalId);
        await dispatch(fetchFixtureEvents(fixtureId)).unwrap();
        const nowStatus =
          getState().fixtureLive.liveStatus?.liveStatus.shortStatus;
        if (_DEBUG_CONSOLE_PRINT)
          console.log('Events fetched. live status : ', nowStatus);
        if (nowStatus && shouldStopFetch(nowStatus)) {
          if (_DEBUG_CONSOLE_PRINT)
            console.log('Events fetch success. clear interval!');
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
