import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FetchFixturesParams,
  fetchFixturesByLeague,
} from '@app/v1/api/endpoints';
import { FixtureByLeagueResponse } from '@app/v1/types/api';
import { RequestStatus } from './leaguesSlice';
import {
  NormalizedFixtureParams,
  normalizeFixtureParams,
} from '@app/v1/utils/fixtureParams';

export interface FixturesState {
  items: FixtureByLeagueResponse[];
  status: RequestStatus;
  error?: string;
  lastFetchedAt?: number;
  selectedLeagueUid?: string;
  lastRequest?: NormalizedFixtureParams;
}

const initialState: FixturesState = {
  items: [],
  status: 'idle',
};

export const loadV1Fixtures = createAsyncThunk(
  'v1/fixtures/load',
  async (params: FetchFixturesParams) => {
    const normalized = normalizeFixtureParams(params);
    const fixtures = await fetchFixturesByLeague(normalized);
    return { fixtures, params: normalized };
  }
);

const fixturesSlice = createSlice({
  name: 'v1/fixtures',
  initialState,
  reducers: {
    setSelectedLeague(state, action: PayloadAction<string | undefined>) {
      state.selectedLeagueUid = action.payload;
    },
    clearFixtures(state) {
      state.items = [];
      state.status = 'idle';
      state.error = undefined;
      state.lastFetchedAt = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadV1Fixtures.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadV1Fixtures.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.fixtures;
        state.lastFetchedAt = Date.now();
        state.lastRequest = action.payload.params;
      })
      .addCase(loadV1Fixtures.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSelectedLeague, clearFixtures } = fixturesSlice.actions;
export const fixturesReducer = fixturesSlice.reducer;
