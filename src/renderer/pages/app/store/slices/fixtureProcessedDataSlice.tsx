import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewLineup } from '@src/types/FixtureIpc';

export interface FixtureProcessedDataState {
  lineup: ProcessedLineup;
}

export interface ProcessedLineup {
  home: ViewLineup | null;
  away: ViewLineup | null;
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
    setProcessedLineup: (state, action: PayloadAction<ProcessedLineup>) => {
      // 이전 값과 비교하여 실제 변경이 있는지 확인
      const currentHome = state.lineup.home;
      const currentAway = state.lineup.away;
      const newHome = action.payload.home;
      const newAway = action.payload.away;

      // 참조 비교로 빠른 체크 (이미 ViewLineupProcessor에서 깊은 비교를 했으므로)
      if (currentHome === newHome && currentAway === newAway) {
        return; // 변경사항이 없으면 업데이트하지 않음
      }

      state.lineup.home = newHome;
      state.lineup.away = newAway;
    },
  },
});

export const { setProcessedLineup } = fixtureProcessedDataSlice.actions;
export default fixtureProcessedDataSlice.reducer;
