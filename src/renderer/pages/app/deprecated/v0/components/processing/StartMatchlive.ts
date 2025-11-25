import { AppDispatch } from '@app/store/store';
import { setFixtureIdAndClearInterval } from '@src/renderer/pages/app/store/slices/live/fixtureLiveSlice';
import { fetchFixtureInfo } from '@src/renderer/pages/app/store/slices/live/fixtureLiveSliceThunk';
import {
  startFetchEvents,
  startFetchLineup,
  startFetchLiveStatus,
  startFetchStatistics,
} from '@src/renderer/pages/app/store/slices/live/fixtureLiveDataUpdater';

export const startFixtureLiveFetch = (
  fixtureId: number,
  dispatch: AppDispatch,
  preferenceKey: string,
) => {
  dispatch(setFixtureIdAndClearInterval(fixtureId));
  dispatch(fetchFixtureInfo(fixtureId));
  dispatch(startFetchLineup(fixtureId, preferenceKey));
  dispatch(startFetchLiveStatus(fixtureId));
  dispatch(startFetchEvents(fixtureId));
  dispatch(startFetchStatistics(fixtureId));
};
