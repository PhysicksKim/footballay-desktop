import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { FixtureEvent } from '@src/types/FixtureIpc';

// 필터에 필요한 이벤트 타입 정의
// export interface FilterEvent {
//   fixtureId: number;
//   sequence: number;
//   type: string;
//   elapsed: number;
//   extraTime: number;
//   teamId: number;
//   playerId: number;
// }

// fixtureLiveControl slice의 초기 상태 정의
interface FixtureLiveControlState {
  filterEvents: FixtureEvent[]; // 필터에 등록된 이벤트들
}

const initialState: FixtureLiveControlState = {
  filterEvents: [], // 초기값은 빈 배열
};

// fixtureLiveControl slice 정의
const fixtureLiveControlSlice = createSlice({
  name: 'fixtureLiveControl',
  initialState,
  reducers: {
    // 필터에 이벤트 추가
    addFilterEvent: (state, action: PayloadAction<FixtureEvent>) => {
      state.filterEvents.push(action.payload);
      // SORT by filterEvents sequence
      state.filterEvents.sort((a, b) => a.sequence - b.sequence);
    },
    // 필터에서 이벤트 제거
    removeFilterEvent: (state, action: PayloadAction<FixtureEvent>) => {
      state.filterEvents = state.filterEvents.filter(
        (event) =>
          !(
            event.sequence === action.payload.sequence &&
            event.type === action.payload.type &&
            event.elapsed === action.payload.elapsed &&
            event.extraTime === action.payload.extraTime &&
            event.team.teamId === action.payload.team.teamId &&
            event.player.playerId === action.payload.player.playerId
          ),
      );
    },
    // 모든 필터 이벤트 초기화
    resetFilterEvents: (state) => {
      state.filterEvents = [];
    },
  },
});

// 액션과 리듀서를 내보내기
export const { addFilterEvent, removeFilterEvent, resetFilterEvents } =
  fixtureLiveControlSlice.actions;
export default fixtureLiveControlSlice.reducer;

// 선택자를 사용해 filterEvents 상태를 가져오는 함수
export const selectFilterEvents = (state: RootState) =>
  state.fixtureLiveControl.filterEvents;
