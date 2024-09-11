import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEvent,
  FixtureInfo,
  FixtureLiveStatus,
  FixtureLineup,
  FixtureEventState,
  EventPlayer,
  FixtureEventMeta,
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
  events: FixtureEventState | null;
  taskState: {
    init: InitTaskState;
  };
  intervalIds: NodeJS.Timeout[]; // interval IDs 배열
  lastFetchedAt: string | null;
}

export type EventMeta =
  | { type: 'subst'; inPlayer: EventPlayer; outPlayer: EventPlayer }
  | { type: 'card'; cardType: 'yellow' | 'red'; player: EventPlayer }
  | { type: 'goal'; scorer: EventPlayer; assist?: EventPlayer }
  | { type: 'var'; decision: string; player?: EventPlayer };

export interface InitTaskState {
  matchliveWindowReady: boolean;
  fixtureIdUpdated: boolean;
  fixtureLiveStateReset: boolean;
}

export const initialState: FixtureState = {
  fixtureId: null,
  info: null,
  liveStatus: null,
  lineup: null,
  events: null,
  taskState: {
    init: {
      matchliveWindowReady: false,
      fixtureIdUpdated: false,
      fixtureLiveStateReset: false,
    },
  },
  intervalIds: [],
  lastFetchedAt: null,
};

const resetFixtureLiveState = (state: FixtureState) => {
  state.info = null;
  state.liveStatus = null;
  state.lineup = null;
  state.events = null;
};

const resetTaskState = (state: FixtureState) => {
  state.taskState.init.matchliveWindowReady = false;
  state.taskState.init.fixtureIdUpdated = false;
  state.taskState.init.fixtureLiveStateReset = false;
};

const removeAllIntervals = (state: FixtureState) => {
  state.intervalIds.forEach((id) => clearInterval(id));
  state.intervalIds = [];
};

const updateLastFetchedAt = (state: FixtureState) => {
  state.lastFetchedAt = new Date().toISOString();
};

const fixtureLiveSlice = createSlice({
  name: 'fixtureLive',
  initialState,
  reducers: {
    setFixtureIdAndClearInterval(state, action: PayloadAction<number>) {
      state.fixtureId = action.payload;
      resetFixtureLiveState(state);
      removeAllIntervals(state);
      state.taskState.init.fixtureIdUpdated = true;
      state.taskState.init.fixtureLiveStateReset = true;
    },
    setMatchliveWindowReady(state, action: PayloadAction<boolean>) {
      state.taskState.init.matchliveWindowReady = action.payload;
    },
    resetInitTaskState(state) {
      state.taskState.init.matchliveWindowReady = false;
      state.taskState.init.fixtureIdUpdated = false;
      state.taskState.init.fixtureLiveStateReset = false;
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
      removeAllIntervals(state);
    },
    clearFixtureLive(state) {
      state.fixtureId = null;
      resetFixtureLiveState(state);
      removeAllIntervals(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchFixtureInfo.fulfilled,
        (state, action: PayloadAction<FixtureInfo>) => {
          state.info = action.payload;
          updateLastFetchedAt(state);
        },
      )
      .addCase(
        fetchFixtureLiveStatus.fulfilled,
        (state, action: PayloadAction<FixtureLiveStatus>) => {
          state.liveStatus = action.payload;
          updateLastFetchedAt(state);
        },
      )
      .addCase(
        fetchFixtureLineup.fulfilled,
        (state, action: PayloadAction<FixtureLineup>) => {
          state.lineup = action.payload;
          updateLastFetchedAt(state);
        },
      )
      .addCase(
        fetchFixtureEvents.fulfilled,
        (state, action: PayloadAction<FixtureEventState>) => {
          const sortedEvents = action.payload.events.sort(
            (a, b) => a.sequence - b.sequence,
          );

          // TODO : SubstMeta 를 이용해 subst in/out 플레이어를 EventMeta 에 추가하는 로직

          const sortedResponse: FixtureEventState = {
            ...action.payload,
            events: sortedEvents,
          };
          state.events = sortedResponse;
          updateLastFetchedAt(state);
        },
      );
  },
});

export const {
  setFixtureIdAndClearInterval,
  addIntervalId,
  removeIntervalId,
  clearAllIntervals,
  setMatchliveWindowReady,
  resetInitTaskState,
  clearFixtureLive,
} = fixtureLiveSlice.actions;
export default fixtureLiveSlice.reducer;
