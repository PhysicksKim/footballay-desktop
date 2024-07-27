import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetchLeagueList from './leagueSliceThunk';
import { League } from '@app/types/football';

interface LeagueState {
  leagues: League[];
}

const initialState: LeagueState = {
  leagues: [],
};

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchLeagueList.fulfilled,
      (state, action: PayloadAction<League[]>) => {
        state.leagues = action.payload;
      },
    );
  },
});

export default leagueSlice.reducer;
