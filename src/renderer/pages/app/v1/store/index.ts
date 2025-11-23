import { combineReducers } from '@reduxjs/toolkit';
import { v1LeaguesReducer } from './leaguesSlice';
import { fixturesReducer } from './fixturesSlice';
import { fixtureDetailReducer } from './fixtureDetailSlice';

export const v1Reducer = combineReducers({
  leagues: v1LeaguesReducer,
  fixtures: fixturesReducer,
  fixtureDetail: fixtureDetailReducer,
});

export type V1State = ReturnType<typeof v1Reducer>;

