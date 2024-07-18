import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEvent,
  League,
  Lineup,
  LiveStatus,
  Team,
} from '../../../../../types/FixtureIpc';
import fetchFixtureInfo from './fixtureSliceThunk';

export interface FixtureState {
  fixtureId: number;
  referee: null | string;
  date: null | string;
  league: null | League;
  liveStatus: null | LiveStatus;
  home: null | Team;
  away: null | Team;
  events: null | FixtureEvent[];
  lineup: {
    home: null | Lineup;
    away: null | Lineup;
  } | null;
  lastFetchTime: string;
}

export const initialState: FixtureState = {
  fixtureId: 1232551,
  referee: null,
  date: null,
  league: null,
  liveStatus: null,
  home: null,
  away: null,
  events: null,
  lineup: null,
  lastFetchTime: new Date().toISOString(),
};

const fixtureSlice = createSlice({
  name: 'fixture',
  initialState,
  reducers: {
    setFixtureId(state, action: PayloadAction<number>) {
      state.fixtureId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFixtureInfo.fulfilled, (state, action) => {
        const fixture = action.payload;
        state.referee = fixture.referee;
        state.date = new Date(fixture.date).toISOString();
        state.liveStatus = fixture.liveStatus;
        state.league = fixture.league;
        state.home = fixture.home;
        state.away = fixture.away;
        state.events = fixture.events;
        state.lineup = fixture.lineup;
        state.lastFetchTime = new Date(fixture.date).toISOString();
      })
      .addCase(fetchFixtureInfo.rejected, (state, action) => {
        console.error('Error fetching fixture info:', action.payload);
      });
  },
});

export const { setFixtureId } = fixtureSlice.actions;
export default fixtureSlice.reducer;
