/**
 * 선택된 리그나 fixture 등을 관리하는 slice
 * 선택된 leagueId, fixtureId, date 등을 관리한다.
 */
import dateToYearMonthDay from '@app/common/DateUtils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedState {
  leagueId: number | null;
  fixtureId: number | null;
  date: string | '';
}

const initialState: SelectedState = {
  leagueId: null,
  fixtureId: null,
  date: new Date().toISOString(),
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    setLeagueId(state, action: PayloadAction<number | null>) {
      state.leagueId = action.payload;
    },
    setFixtureId(state, action: PayloadAction<number | null>) {
      state.fixtureId = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    resetSelected(state) {
      state.leagueId = null;
      state.fixtureId = null;
      state.date = new Date().toISOString();
    },
  },
});

export const { setLeagueId, setFixtureId, setDate, resetSelected } =
  selectedSlice.actions;
export default selectedSlice.reducer;
