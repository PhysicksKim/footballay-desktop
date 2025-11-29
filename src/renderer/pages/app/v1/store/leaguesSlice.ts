import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AvailableLeagueResponse } from '@app/v1/types/api';
import { fetchAvailableLeagues } from '@app/v1/api/endpoints';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface V1LeaguesState {
  items: AvailableLeagueResponse[];
  status: RequestStatus;
  error?: string;
}

const initialState: V1LeaguesState = {
  items: [],
  status: 'idle',
};

export const loadV1Leagues = createAsyncThunk('v1/leagues/load', async () => {
  const leagues = await fetchAvailableLeagues();
  return leagues;
});

const v1LeaguesSlice = createSlice({
  name: 'v1/leagues',
  initialState,
  reducers: {
    resetLeaguesStatus: (state) => {
      state.status = 'idle';
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadV1Leagues.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadV1Leagues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadV1Leagues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetLeaguesStatus } = v1LeaguesSlice.actions;
export const v1LeaguesReducer = v1LeaguesSlice.reducer;
