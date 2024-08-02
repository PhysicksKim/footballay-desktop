import { configureStore } from '@reduxjs/toolkit';
import fixtureReducer from './slices/fixtureSlice';
import fixtureListReducer from './slices/fixtureListSlice';
import leagueReducer from './slices/leagueSlice';
import footballSelectionReducer from './slices/footballSelectionSlice';
import ipcStatusReducer from './slices/ipc/ipcStatusSlice';

const store = configureStore({
  reducer: {
    fixture: fixtureReducer,
    fixtureList: fixtureListReducer,
    league: leagueReducer,
    selected: footballSelectionReducer,
    ipcStatus: ipcStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
