import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FixtureInfo, League, Team } from '../../../../../types/FixtureIpc';

/**
 * Date 를 사용하는 date, lastFetchTime 변수는 string 으로 변환해서 저장한다. <br>
 * Redux State 에는 Serializable 한 값만 들어갈 수 있기 때문이다.
 */
export interface FixtureState {}

export const initialState: FixtureState = {};

const fixtureSlice = createSlice({
  name: 'fixture',
  initialState,
  reducers: {},
});

export const {} = fixtureSlice.actions;
export default fixtureSlice.reducer;
