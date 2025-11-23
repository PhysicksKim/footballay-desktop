import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEventsResponse,
  FixtureInfoResponse,
  FixtureLineupResponse,
  FixtureLiveStatusResponse,
  FixtureStatisticsResponse,
} from '@app/v1/types/api';

export interface V1FixtureState {
  info?: FixtureInfoResponse;
  liveStatus?: FixtureLiveStatusResponse;
  lineup?: FixtureLineupResponse;
  events?: FixtureEventsResponse;
  statistics?: FixtureStatisticsResponse;
}

const initialState: V1FixtureState = {};

const v1FixtureSlice = createSlice({
  name: 'v1Fixture',
  initialState,
  reducers: {
    setV1FixtureInfo(state, action: PayloadAction<FixtureInfoResponse | undefined>) {
      state.info = action.payload;
    },
    setV1FixtureLiveStatus(
      state,
      action: PayloadAction<FixtureLiveStatusResponse | undefined>
    ) {
      state.liveStatus = action.payload;
    },
    setV1FixtureLineup(
      state,
      action: PayloadAction<FixtureLineupResponse | undefined>
    ) {
      state.lineup = action.payload;
    },
    setV1FixtureEvents(
      state,
      action: PayloadAction<FixtureEventsResponse | undefined>
    ) {
      state.events = action.payload;
    },
    setV1FixtureStatistics(
      state,
      action: PayloadAction<FixtureStatisticsResponse | undefined>
    ) {
      state.statistics = action.payload;
    },
    resetV1Fixture(state) {
      state.info = undefined;
      state.liveStatus = undefined;
      state.lineup = undefined;
      state.events = undefined;
      state.statistics = undefined;
    },
  },
});

export const {
  setV1FixtureInfo,
  setV1FixtureLiveStatus,
  setV1FixtureLineup,
  setV1FixtureEvents,
  setV1FixtureStatistics,
  resetV1Fixture,
} = v1FixtureSlice.actions;

// Selectors
export const selectIsV1Mode = (state: { v1Fixture: V1FixtureState }) =>
  !!state.v1Fixture.info;

export default v1FixtureSlice.reducer;

