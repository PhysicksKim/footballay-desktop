// src/store/slices/fixtureProcessedDataSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewLineup } from '@src/types/FixtureIpc';

export interface FixtureProcessedDataState {
  lineup: {
    home: {
      viewLineup: ViewLineup | null;
    };
    away: {
      viewLineup: ViewLineup | null;
    };
  };
}

const initialState: FixtureProcessedDataState = {
  lineup: {
    home: {
      viewLineup: null,
    },
    away: {
      viewLineup: null,
    },
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
      state.lineup.home.viewLineup = action.payload.home;
      state.lineup.away.viewLineup = action.payload.away;
    },
  },
});

export const { setProcessedLineup } = fixtureProcessedDataSlice.actions;
export default fixtureProcessedDataSlice.reducer;
