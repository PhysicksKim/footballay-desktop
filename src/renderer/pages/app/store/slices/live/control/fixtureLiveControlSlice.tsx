import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@app/store/store';
import { FixtureEvent } from '@src/types/FixtureIpc';

interface FixtureLiveControlState {
  filterEvents: FixtureEvent[];
}

const initialState: FixtureLiveControlState = {
  filterEvents: [],
};

const fixtureLiveControlSlice = createSlice({
  name: 'fixtureLiveControl',
  initialState,
  reducers: {
    addFilterEvent: (state, action: PayloadAction<FixtureEvent>) => {
      state.filterEvents.push(action.payload);
      state.filterEvents.sort((a, b) => a.sequence - b.sequence);
    },
    removeFilterEvent: (state, action: PayloadAction<FixtureEvent>) => {
      state.filterEvents = state.filterEvents.filter(
        (event) =>
          !(
            event.sequence === action.payload.sequence &&
            event.type === action.payload.type &&
            event.elapsed === action.payload.elapsed &&
            event.extraTime === action.payload.extraTime &&
            event.team.teamId === action.payload.team.teamId &&
            event.player?.playerId === action.payload.player?.playerId
          ),
      );
    },
    resetFilterEvents: (state) => {
      state.filterEvents = [];
    },
  },
});

export const { addFilterEvent, removeFilterEvent, resetFilterEvents } =
  fixtureLiveControlSlice.actions;
export default fixtureLiveControlSlice.reducer;

export const selectFilterEvents = (state: RootState) =>
  state.fixtureLiveControl.filterEvents;
