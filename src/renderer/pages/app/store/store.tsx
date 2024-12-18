import { configureStore } from '@reduxjs/toolkit';
import ipcStatusReducer from './slices/ipc/ipcStatusSlice';
import leagueReducer from './slices/select/league/leagueSlice';
import fixtureListReducer from './slices/select/list/fixtureListSlice';
import footballSelectionReducer from './slices/select/footballSelectionSlice';
import fixtureLiveReducer from './slices/live/fixtureLiveSlice';
import fixtureLiveOptionReducer from './slices/live/option/fixtureLiveOptionSlice';
import fixtureLiveControlReducer from './slices/live/control/fixtureLiveControlSlice';
import fixtureProcessedDataSlice from './slices/fixtureProcessedDataSlice';

const store = configureStore({
  reducer: {
    ipcStatus: ipcStatusReducer,
    league: leagueReducer,
    /**
     * 선택된 리그와 날짜의 경기 리스트 정보를 담음.
     */
    fixtureList: fixtureListReducer,
    selected: footballSelectionReducer,
    fixtureLive: fixtureLiveReducer,
    fixtureLiveOption: fixtureLiveOptionReducer,
    fixtureLiveControl: fixtureLiveControlReducer,
    fixtureProcessedData: fixtureProcessedDataSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
