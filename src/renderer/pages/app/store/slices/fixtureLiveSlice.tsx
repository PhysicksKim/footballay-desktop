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
  intervalIds: NodeJS.Timeout[]; // interval IDs 배열 추가
}

export const initialState: FixtureState = {
  fixtureId: null,
  info: null,
  liveStatus: null,
  lineup: null,
  events: null,
  intervalIds: [], // 초기값 설정
};

const fixtureLiveSlice = createSlice({
  name: 'fixtureLive',
  initialState,
  reducers: {
    setFixtureIdAndClearInterval(state, action: PayloadAction<number>) {
      console.log('setFixtureIdAndClearInterval');
      state.fixtureId = action.payload;
      state.intervalIds.forEach((id) => {
        clearInterval(id);
        console.log('clearInterval', id);
      });
      state.intervalIds = [];
    },
    addIntervalId(state, action: PayloadAction<NodeJS.Timeout>) {
      state.intervalIds.push(action.payload);
    },
    removeIntervalId(state, action: PayloadAction<NodeJS.Timeout>) {
      state.intervalIds = state.intervalIds.filter(
        (id) => id !== action.payload,
      );
    },
    clearAllIntervals(state) {
      state.intervalIds.forEach((id) => clearInterval(id));
      state.intervalIds = [];
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

export const {
  setFixtureIdAndClearInterval,
  addIntervalId,
  removeIntervalId,
  clearAllIntervals,
} = fixtureLiveSlice.actions;
export default fixtureLiveSlice.reducer;
