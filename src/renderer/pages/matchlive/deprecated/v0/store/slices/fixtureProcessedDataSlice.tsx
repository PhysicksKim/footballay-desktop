import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewLineup } from '@src/types/FixtureIpc';

export interface FixtureProcessedDataState {
  lineup: {
    home: ViewLineup | null;
    away: ViewLineup | null;
  };
}

const initialState: FixtureProcessedDataState = {
  lineup: {
    home: null,
    away: null,
  },
};

const fixtureProcessedDataSlice = createSlice({
  name: 'fixtureProcessedData',
  initialState,
  reducers: {
    setProcessedLineup: (
      state,
      action: PayloadAction<{
        home: ViewLineup | null;
        away: ViewLineup | null;
      }>,
    ) => {
      state.lineup.home = action.payload.home;
      state.lineup.away = action.payload.away;
    },
  },
});

export const { setProcessedLineup } = fixtureProcessedDataSlice.actions;
export default fixtureProcessedDataSlice.reducer;
