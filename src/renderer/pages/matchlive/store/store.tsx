import { configureStore } from '@reduxjs/toolkit';
import fixtureReducer from './slices/fixtureSlice';
import colorOptionSlice from './slices/colorOptionSlice';

const store = configureStore({
  reducer: {
    fixture: fixtureReducer,
    colorOption: colorOptionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
