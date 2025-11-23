import { configureStore } from '@reduxjs/toolkit';
import ipcStatusReducer from './slices/ipc/ipcStatusSlice';
import leagueReducer from './slices/select/league/leagueSlice';
import fixtureListReducer from './slices/select/list/fixtureListSlice';
import footballSelectionReducer from './slices/select/footballSelectionSlice';
import fixtureLiveReducer from './slices/live/fixtureLiveSlice';
import fixtureLiveOptionReducer from './slices/live/option/fixtureLiveOptionSlice';
import fixtureLiveControlReducer from './slices/live/control/fixtureLiveControlSlice';
import fixtureProcessedDataSlice from './slices/fixtureProcessedDataSlice';
import WindowInfoSlice from './slices/states/WindowInfoSlice';
import { useDispatch } from 'react-redux';
import { loadPreferenceKey } from './slices/live/option/preferenceKeyIO';
import {
  featureFlagsReducer,
  loadFeatureFlags,
} from './slices/settings/featureFlagsSlice';
import { v1Reducer } from '@app/v1/store';
import {
  loadV1Preferences,
  v1PreferencesReducer,
} from './slices/settings/v1PreferencesSlice';

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
    windowInfo: WindowInfoSlice,
    featureFlags: featureFlagsReducer,
    v1: v1Reducer,
    v1Preferences: v1PreferencesReducer,
  },
});

/**
 * 초기에 로드 해야할 것들을 여기서 처리합니다.
 */
const initDispatchActions = () => {
  store.dispatch(loadPreferenceKey());
  store.dispatch(loadFeatureFlags());
  store.dispatch(loadV1Preferences());
};
initDispatchActions();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
