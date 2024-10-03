import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEventState,
  FixtureInfo,
  FixtureLineup,
  FixtureLiveStatus,
  FixtureStatistics,
} from '@src/types/FixtureIpc';

/**
 * Date 를 사용하는 date, lastFetchTime 변수는 string 으로 변환해서 저장한다. <br>
 * Redux State 에는 Serializable 한 값만 들어갈 수 있기 때문이다.
 */
export interface FixtureState {
  fixtureId: string | null;
  info: FixtureInfo | null;
  lineup: FixtureLineup | null;
  events: FixtureEventState | null;
  liveStatus: FixtureLiveStatus | null;
  statistics: FixtureStatistics | null;
  intervalIds: NodeJS.Timeout[];
}

export const initialState: FixtureState = {
  fixtureId: null,
  info: null,
  lineup: null,
  events: null,
  liveStatus: null,
  statistics: null,
  intervalIds: [],
};

const fixtureSlice = createSlice({
  name: 'fixture',
  initialState,
  reducers: {
    setFixtureId(state, action: PayloadAction<string>) {
      state.fixtureId = action.payload;
    },
    setFixtureInfo(state, action: PayloadAction<FixtureInfo>) {
      state.info = action.payload;
    },
    setFixtureLineup(state, action: PayloadAction<FixtureLineup>) {
      state.lineup = action.payload;
    },
    setFixtureEvents(state, action: PayloadAction<FixtureEventState>) {
      state.events = action.payload;
    },
    setFixtureLiveStatus(state, action: PayloadAction<FixtureLiveStatus>) {
      state.liveStatus = action.payload;
    },
    setFixtureStatistics(state, action: PayloadAction<FixtureStatistics>) {
      state.statistics = action.payload;
    },
    clearFixture(state) {
      state.fixtureId = null;
      state.info = null;
      state.lineup = null;
      state.events = null;
      state.liveStatus = null;
    },
  },
});

export const {
  setFixtureId,
  setFixtureInfo,
  setFixtureLineup,
  setFixtureEvents,
  setFixtureLiveStatus,
  setFixtureStatistics,
  clearFixture,
} = fixtureSlice.actions;
export default fixtureSlice.reducer;
