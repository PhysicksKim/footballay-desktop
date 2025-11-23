import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchFixtureEvents,
  fetchFixtureInfo,
  fetchFixtureLineup,
  fetchFixtureLiveStatus,
  fetchFixtureStatistics,
} from '@app/v1/api/endpoints';
import {
  FixtureEventsResponse,
  FixtureInfoResponse,
  FixtureLineupResponse,
  FixtureLiveStatusResponse,
  FixtureStatisticsResponse,
} from '@app/v1/types/api';
import { RequestStatus } from './leaguesSlice';

export interface FixtureDetailState {
  targetFixtureUid?: string;
  info?: FixtureInfoResponse;
  liveStatus?: FixtureLiveStatusResponse;
  lineup?: FixtureLineupResponse;
  events?: FixtureEventsResponse;
  statistics?: FixtureStatisticsResponse;
  status: {
    info: RequestStatus;
    liveStatus: RequestStatus;
    lineup: RequestStatus;
    events: RequestStatus;
    statistics: RequestStatus;
  };
  error?: string;
}

const initialState: FixtureDetailState = {
  status: {
    info: 'idle',
    liveStatus: 'idle',
    lineup: 'idle',
    events: 'idle',
    statistics: 'idle',
  },
};

const buildAsyncThunk = <T>(
  type: string,
  fetcher: (fixtureUid: string) => Promise<T>
) =>
  createAsyncThunk(`${type}`, async (fixtureUid: string) => {
    const data = await fetcher(fixtureUid);
    return data;
  });

export const loadV1FixtureInfo = buildAsyncThunk(
  'v1/fixture/info',
  fetchFixtureInfo
);
export const loadV1FixtureLiveStatus = buildAsyncThunk(
  'v1/fixture/liveStatus',
  fetchFixtureLiveStatus
);
export const loadV1FixtureLineup = buildAsyncThunk(
  'v1/fixture/lineup',
  fetchFixtureLineup
);
export const loadV1FixtureEvents = buildAsyncThunk(
  'v1/fixture/events',
  fetchFixtureEvents
);
export const loadV1FixtureStatistics = buildAsyncThunk(
  'v1/fixture/statistics',
  fetchFixtureStatistics
);

const fixtureDetailSlice = createSlice({
  name: 'v1/fixtureDetail',
  initialState,
  reducers: {
    setTargetFixture(state, action: PayloadAction<string | undefined>) {
      state.targetFixtureUid = action.payload;
    },
    resetFixtureDetail(state) {
      state.info = undefined;
      state.liveStatus = undefined;
      state.lineup = undefined;
      state.events = undefined;
      state.statistics = undefined;
      state.status = {
        info: 'idle',
        liveStatus: 'idle',
        lineup: 'idle',
        events: 'idle',
        statistics: 'idle',
      };
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadV1FixtureInfo.pending, (state) => {
        state.status.info = 'loading';
      })
      .addCase(loadV1FixtureInfo.fulfilled, (state, action) => {
        state.status.info = 'succeeded';
        state.info = action.payload;
      })
      .addCase(loadV1FixtureInfo.rejected, (state, action) => {
        state.status.info = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadV1FixtureLiveStatus.pending, (state) => {
        state.status.liveStatus = 'loading';
      })
      .addCase(loadV1FixtureLiveStatus.fulfilled, (state, action) => {
        state.status.liveStatus = 'succeeded';
        state.liveStatus = action.payload;
      })
      .addCase(loadV1FixtureLiveStatus.rejected, (state, action) => {
        state.status.liveStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadV1FixtureLineup.pending, (state) => {
        state.status.lineup = 'loading';
      })
      .addCase(loadV1FixtureLineup.fulfilled, (state, action) => {
        state.status.lineup = 'succeeded';
        state.lineup = action.payload;
      })
      .addCase(loadV1FixtureLineup.rejected, (state, action) => {
        state.status.lineup = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadV1FixtureEvents.pending, (state) => {
        state.status.events = 'loading';
      })
      .addCase(loadV1FixtureEvents.fulfilled, (state, action) => {
        state.status.events = 'succeeded';
        state.events = action.payload;
      })
      .addCase(loadV1FixtureEvents.rejected, (state, action) => {
        state.status.events = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadV1FixtureStatistics.pending, (state) => {
        state.status.statistics = 'loading';
      })
      .addCase(loadV1FixtureStatistics.fulfilled, (state, action) => {
        state.status.statistics = 'succeeded';
        state.statistics = action.payload;
      })
      .addCase(loadV1FixtureStatistics.rejected, (state, action) => {
        state.status.statistics = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setTargetFixture, resetFixtureDetail } =
  fixtureDetailSlice.actions;
export const fixtureDetailReducer = fixtureDetailSlice.reducer;
