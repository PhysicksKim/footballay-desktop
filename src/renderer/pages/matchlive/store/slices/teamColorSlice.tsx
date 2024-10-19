import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTeamColor } from '@src/renderer/pages/matchlive/utils/TeamColor';

interface TeamColorState {
  homeColor: string;
  awayColor: string;
}

const initialState: TeamColorState = {
  homeColor: '#c73636',
  awayColor: '#282ab9',
};

const teamColorSlice = createSlice({
  name: 'teamColor',
  initialState,
  reducers: {
    setTeamColors(
      state,
      action: PayloadAction<{ homeId: number; awayId: number }>,
    ) {
      const teamColor = getTeamColor(
        action.payload.homeId,
        action.payload.awayId,
      );
      state.homeColor = teamColor.homeColor;
      state.awayColor = teamColor.awayColor;
    },
    resetTeamColors(state) {
      state = initialState;
    },
  },
});

export const { setTeamColors, resetTeamColors } = teamColorSlice.actions;
export default teamColorSlice.reducer;
