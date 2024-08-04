import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEvent,
  FixtureInfo,
  FixtureLiveStatus,
  FixtureLineup,
  FixtureEventResponse,
} from '@src/types/FixtureIpc';
import {
  fetchFixtureEvents,
  fetchFixtureInfo,
  fetchFixtureLineup,
  fetchFixtureLiveStatus,
} from './fixtureLiveSliceThunk';
import { AppDispatch, RootState } from '../store';

export interface FixtureState {
  fixtureId: number | null;
  info: FixtureInfo | null;
  liveStatus: FixtureLiveStatus | null;
  lineup: FixtureLineup | null;
  events: FixtureEventResponse | null;
  intervalFetch: boolean;
}

export const initialState: FixtureState = {
  fixtureId: null,
  info: null,
  liveStatus: null,
  lineup: null,
  events: null,
  intervalFetch: false,
};

const fixtureLiveSlice = createSlice({
  name: 'fixtureLive',
  initialState,
  reducers: {
    setFixtureId(state, action: PayloadAction<number>) {
      state.fixtureId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchFixtureInfo.fulfilled,
        (state, action: PayloadAction<FixtureInfo>) => {
          state.info = action.payload;
        },
      )
      .addCase(
        fetchFixtureLiveStatus.fulfilled,
        (state, action: PayloadAction<FixtureLiveStatus>) => {
          state.liveStatus = action.payload;
        },
      )
      .addCase(
        fetchFixtureLineup.fulfilled,
        (state, action: PayloadAction<FixtureLineup>) => {
          state.lineup = action.payload;
        },
      )
      .addCase(
        fetchFixtureEvents.fulfilled,
        (state, action: PayloadAction<FixtureEventResponse>) => {
          state.events = action.payload;
        },
      );
  },
});

export const { setFixtureId } = fixtureLiveSlice.actions;
export default fixtureLiveSlice.reducer;
