import { configureStore } from '@reduxjs/toolkit';
import fixtureReducer from './slices/fixtureSlice';
import fixtureLiveOptionSlice from './slices/fixtureLiveOptionSlice';

const store = configureStore({
  reducer: {
    fixture: fixtureReducer,
    options: fixtureLiveOptionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
