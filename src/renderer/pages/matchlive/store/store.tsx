import { configureStore } from '@reduxjs/toolkit';
import fixtureReducer from './slices/fixtureSlice';
import fixtureLiveOptionSlice from './slices/fixtureLiveOptionSlice';
import fixtureProcessedDataSlice from './slices/fixtureProcessedDataSlice';
import teamColorSlice from './slices/teamColorSlice';

const store = configureStore({
  reducer: {
    fixture: fixtureReducer,
    fixtureProcessedData: fixtureProcessedDataSlice,
    options: fixtureLiveOptionSlice,
    teamColor: teamColorSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
