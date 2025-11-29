import { configureStore } from '@reduxjs/toolkit';
import WindowInfoSlice from './slices/states/WindowInfoSlice';
import { useDispatch } from 'react-redux';
import {
  featureFlagsReducer,
  loadFeatureFlags,
} from './slices/settings/featureFlagsSlice';
import { v1Reducer } from '@app/v1/store';
import {
  loadV1Preferences,
  v1PreferencesReducer,
} from './slices/settings/v1PreferencesSlice';
import {
  cfAccessReducer,
  loadCfAccessCredentials,
} from './slices/settings/cfAccessSlice';
import eventFilterReducer from './slices/control/eventFilterSlice';
import fixtureLiveReducer from './slices/live/fixtureLiveSlice';
import { appEnv } from '@app/config/environment';
import { injectStore } from '@app/v1/api/httpClient';

const store = configureStore({
  reducer: {
    windowInfo: WindowInfoSlice,
    featureFlags: featureFlagsReducer,
    v1: v1Reducer,
    v1Preferences: v1PreferencesReducer,
    cfAccess: cfAccessReducer,
    eventFilter: eventFilterReducer,
    fixtureLive: fixtureLiveReducer,
  },
});

// Inject store into httpClient to avoid circular dependency
injectStore(store);

/**
 * 초기에 로드 해야할 것들을 여기서 처리합니다.
 */
const initDispatchActions = () => {
  store.dispatch(loadFeatureFlags());
  store.dispatch(loadV1Preferences());
  if (appEnv === 'dev') {
    store.dispatch(loadCfAccessCredentials());
  }
};
initDispatchActions();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
