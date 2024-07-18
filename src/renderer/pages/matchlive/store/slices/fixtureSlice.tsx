import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEvent,
  League,
  Lineup,
  LiveStatus,
  Team,
} from '../../../../../types/FixtureIpc';

/**
 * Date 를 사용하는 date, lastFetchTime 변수는 string 으로 변환해서 저장한다. <br>
 * Redux State 에는 Serializable 한 값만 들어갈 수 있기 때문이다.
 */
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
    setReferee(state, action: PayloadAction<string>) {
      state.referee = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    setLeague(state, action: PayloadAction<League>) {
      state.league = action.payload;
    },
    setLiveStatus(state, action: PayloadAction<LiveStatus>) {
      state.liveStatus = action.payload;
    },
    setHome(state, action: PayloadAction<Team>) {
      state.home = action.payload;
    },
    setAway(state, action: PayloadAction<Team>) {
      state.away = action.payload;
    },
    setEvents(state, action: PayloadAction<FixtureEvent[]>) {
      state.events = action.payload;
    },
    setLineup(state, action: PayloadAction<{ home: Lineup; away: Lineup }>) {
      state.lineup = action.payload;
    },
    setLastFetchTime(state, action: PayloadAction<string>) {
      state.lastFetchTime = action.payload;
    },
    setFixtureState(state, action: PayloadAction<FixtureState>) {
      return action.payload;
    },
  },
});

export const {
  setFixtureId,
  setReferee,
  setDate,
  setLeague,
  setLiveStatus,
  setHome,
  setAway,
  setEvents,
  setLineup,
  setLastFetchTime,
  setFixtureState,
} = fixtureSlice.actions;
export default fixtureSlice.reducer;
