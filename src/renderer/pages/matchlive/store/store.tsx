import { configureStore } from '@reduxjs/toolkit';
import fixtureReducer from './slices/fixtureSlice';

const store = configureStore({
  reducer: {
    fixture: fixtureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
