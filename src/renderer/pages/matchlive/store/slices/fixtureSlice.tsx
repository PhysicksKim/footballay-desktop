import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEventsResponse,
  FixtureInfoResponse,
  FixtureLineupResponse,
  FixtureLiveStatusResponse,
  FixtureStatisticsResponse,
} from '@app/v1/types/api';

export interface FixtureState {
  info?: FixtureInfoResponse;
  liveStatus?: FixtureLiveStatusResponse;
  lineup?: FixtureLineupResponse;
  events?: FixtureEventsResponse;
  statistics?: FixtureStatisticsResponse;
}

const initialState: FixtureState = {};

const fixtureSlice = createSlice({
  name: 'fixture',
  initialState,
  reducers: {
    setFixtureInfo(state, action: PayloadAction<FixtureInfoResponse | undefined>) {
      state.info = action.payload;
    },
    setFixtureLiveStatus(
      state,
      action: PayloadAction<FixtureLiveStatusResponse | undefined>
    ) {
      state.liveStatus = action.payload;
    },
    setFixtureLineup(
      state,
      action: PayloadAction<FixtureLineupResponse | undefined>
    ) {
      state.lineup = action.payload;
    },
    setFixtureEvents(
      state,
      action: PayloadAction<FixtureEventsResponse | undefined>
    ) {
      state.events = action.payload;
    },
    setFixtureStatistics(
      state,
      action: PayloadAction<FixtureStatisticsResponse | undefined>
    ) {
      state.statistics = action.payload;
    },
    resetFixture(state) {
      state.info = undefined;
      state.liveStatus = undefined;
      state.lineup = undefined;
      state.events = undefined;
      state.statistics = undefined;
    },
  },
});

export const {
  setFixtureInfo,
  setFixtureLiveStatus,
  setFixtureLineup,
  setFixtureEvents,
  setFixtureStatistics,
  resetFixture,
} = fixtureSlice.actions;

export default fixtureSlice.reducer;

