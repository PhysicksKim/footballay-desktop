/**
 * 선택한 fixture 의 라이브 정보 데이터를 관리합니다.
 * leagueId, fixtureId, homeTeamId, awayTeamId 를 기본 정보로 가집니다.
 * fixture live 정보는 라인업, 이벤트 정보를 기본으로 하며,
 * 선수별 평점, 선수별 스텟 통계, 매치 통계 등을 추가로 가집니다.
 */
import { createSlice } from '@reduxjs/toolkit';
import { MatchState } from './matchLiveTypes';
import { fetchEvents, fetchInfos } from './matchLiveSliceThunk';

const initialState: MatchState = {
  fixtureId: null,
  infos: null,
  events: null,
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setFixtureId(state, action) {
      state.fixtureId = action.payload;
    },
    clearMatchData(state) {
      state.infos = null;
      state.events = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchInfos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInfos.fulfilled, (state, action) => {
        if (!action.payload || !(action.payload.length !== 1)) {
          return;
        }
        state.infos = action.payload[0];
        state.loading = false;
      })
      .addCase(fetchInfos.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setFixtureId, clearMatchData } = matchSlice.actions;
export default matchSlice.reducer;
