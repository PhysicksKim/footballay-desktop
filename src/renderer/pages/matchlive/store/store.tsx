import { configureStore } from '@reduxjs/toolkit';
import fixtureReducer from './slices/fixtureSlice';
import fixtureLiveOptionSlice from './slices/fixtureLiveOptionSlice';
import fixtureProcessedDataSlice from './slices/fixtureProcessedDataSlice';
import teamColorSlice from './slices/teamColorSlice';
import v1FixtureSlice from './slices/v1FixtureSlice';

const store = configureStore({
  reducer: {
    fixture: fixtureReducer,
    fixtureProcessedData: fixtureProcessedDataSlice,
    options: fixtureLiveOptionSlice,
    teamColor: teamColorSlice,
    v1Fixture: v1FixtureSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
