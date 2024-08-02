import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'date-fns';

const initialState = {
  waitFixtureInfo: false,
};

const ipcStatusSlice = createSlice({
  name: 'ipcStatus',
  initialState,
  reducers: {
    setWaitFixtureInfo: (state, action: PayloadAction<boolean>) => {
      state.waitFixtureInfo = action.payload;
    },
  },
});

export const { setWaitFixtureInfo } = ipcStatusSlice.actions;
export default ipcStatusSlice.reducer;
