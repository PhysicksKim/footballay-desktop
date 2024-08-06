import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixtureEventResponse,
  FixtureInfo,
  FixtureLineup,
  FixtureLiveStatus,
} from '@src/types/FixtureIpc';

/**
 * Date 를 사용하는 date, lastFetchTime 변수는 string 으로 변환해서 저장한다. <br>
 * Redux State 에는 Serializable 한 값만 들어갈 수 있기 때문이다.
 */
export interface FixtureState {
  fixtureId: string | null;
  info: FixtureInfo | null;
  lineup: FixtureLineup | null;
  events: FixtureEventResponse | null;
  liveStatus: FixtureLiveStatus | null;
  intervalIds: NodeJS.Timeout[];
}

export const initialState: FixtureState = {
  fixtureId: null,
  info: null,
  lineup: null,
  events: null,
  liveStatus: null,
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
    setFixtureEvents(state, action: PayloadAction<FixtureEventResponse>) {
      state.events = action.payload;
    },
    setFixtureLiveStatus(state, action: PayloadAction<FixtureLiveStatus>) {
      state.liveStatus = action.payload;
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
  clearFixture,
} = fixtureSlice.actions;
export default fixtureSlice.reducer;
