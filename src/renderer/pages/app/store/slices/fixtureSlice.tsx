import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { League, Team } from '../../../../../types/FixtureIpc';
import fetchFixtureInfo from './fixtureSliceThunk';

export type EventType = 'GOAL' | 'CARD' | 'SUBST' | 'VAR' | string;

export interface EventTeam {
  teamId: number;
  name: string;
  koreanName: string;
}

export interface EventPlayer {
  playerId: number;
  name: string;
  koreanName: string;
  number: number;
}

export interface FixtureEvent {
  sequence: number;
  elapsed: number;
  extraTime: number;
  team: EventTeam;
  player: EventPlayer;
  assist: EventPlayer | null;
  type: EventType;
  detail: string;
  comments: string | null;
}

export interface FixtureLiveStatus {
  elapsed: number;
  shortStatus: string;
  longStatus: string;
}

export interface FixtureInfo {
  fixtureId: number;
  referee: string;
  date: string;
  league: League;
  home: Team;
  away: Team;
}

export interface FixtureState {
  info: FixtureInfo | null;
  liveStatus: FixtureLiveStatus | null;
  lineup: FixtureLineup | null;
  events: FixtureEvent[] | null;
  intervalFetch: boolean;
}

export const initialState: FixtureState = {
  info: null,
  liveStatus: null,
  lineup: null,
  events: null,
  intervalFetch: false,
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
