import { createSlice } from '@reduxjs/toolkit';

export interface TeamColorState {
  home: string;
  away: string;
}

const teamColorSlice = createSlice({
  initialState: {
    home: '',
    away: '',
  },
  name: 'teamColor',
  reducers: {
    setTeamColor(state, action) {
      state.home = action.payload.home;
      state.away = action.payload.away;
    },
  },
});

export const { setTeamColor } = teamColorSlice.actions;
export default teamColorSlice.reducer;
