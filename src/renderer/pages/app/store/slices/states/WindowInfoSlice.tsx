import { createSlice } from '@reduxjs/toolkit';

export interface WindowInfoState {
  matchliveAlwaysOnTop: boolean;
}

const initialState: WindowInfoState = {
  matchliveAlwaysOnTop: false,
};

const windowInfoSlice = createSlice({
  name: 'windowInfo',
  initialState,
  reducers: {
    setMatchliveAlwaysOnTop: (state, action) => {
      state.matchliveAlwaysOnTop = action.payload;
    },
  },
});

export const { setMatchliveAlwaysOnTop } = windowInfoSlice.actions;
export default windowInfoSlice.reducer;
