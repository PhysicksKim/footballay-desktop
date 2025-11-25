import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@app/store/store';
import { EventInfo } from '@app/v1/types/api';

interface EventFilterState {
  filterEvents: EventInfo[];
}

const initialState: EventFilterState = {
  filterEvents: [],
};

const eventFilterSlice = createSlice({
  name: 'eventFilter',
  initialState,
  reducers: {
    addFilterEvent: (state, action: PayloadAction<EventInfo>) => {
      // 이미 존재하는지 확인 (sequence 기반)
      const exists = state.filterEvents.some(
        (event) => event.sequence === action.payload.sequence
      );
      if (!exists) {
        state.filterEvents.push(action.payload);
        // sequence 순서로 정렬
        state.filterEvents.sort((a, b) => a.sequence - b.sequence);
      }
    },
    removeFilterEvent: (state, action: PayloadAction<EventInfo>) => {
      state.filterEvents = state.filterEvents.filter(
        (event) => event.sequence !== action.payload.sequence
      );
    },
    resetFilterEvents: (state) => {
      state.filterEvents = [];
    },
  },
});

export const { addFilterEvent, removeFilterEvent, resetFilterEvents } =
  eventFilterSlice.actions;

export const selectFilterEvents = (state: RootState) =>
  state.eventFilter.filterEvents;

export default eventFilterSlice.reducer;

