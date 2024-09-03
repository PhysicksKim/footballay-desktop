import { createAsyncThunk, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import Urls from '@app/constants/Urls';
import {
  FixtureInfo,
  FixtureLiveStatus,
  FixtureLineup,
  FixtureEventResponse,
} from '@src/types/FixtureIpc';
import { AppDispatch, RootState } from '../store';

export const fetchFixtureInfo = createAsyncThunk<
  FixtureInfo,
  number,
  { rejectValue: string }
>(
  'fixture/fetchFixtureInfo',
  async (fixtureId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${Urls.apiUrl}${Urls.football.fixtureInfo}`,
        { params: { fixtureId } },
      );
      return response.data.response[0];
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export const fetchFixtureLiveStatus = createAsyncThunk<
  FixtureLiveStatus,
  number,
  { rejectValue: string }
>('fixture/fetchLiveStatus', async (fixtureId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${Urls.apiUrl}${Urls.football.fixtureLiveStatus}`,
      { params: { fixtureId } },
    );
    return response.data.response[0];
  } catch (error: any) {
    return rejectWithValue(
      error.response ? error.response.data : error.message,
    );
  }
});

// TODO : name decode 가 필요합니다.
/**
 * "playerId": 307123,
 * "name": "N. O&apos;Reilly",
 * 예를 들어 위와 같은 선수 이름의 경우 &apos; 를 ' 로 변환해주어야 합니다. (어포스트로피)
 * 이를 위해 html-entities 라이브러리를 사용하기로 생각중입니다.
 * he 가 많이 언급되고 쓰이기는 하는데 6년전이 마지막 publish 이므로
 * html-entities 를 사용하는 것이 더 좋을 것 같습니다.
 * decode는 아래의 api 응답에서 각 문자열 항목들에 대해 decode 해주면 될 것 같다.
 */
export const fetchFixtureLineup = createAsyncThunk<
  FixtureLineup,
  number,
  { rejectValue: string }
>('fixture/fetchLineup', async (fixtureId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${Urls.apiUrl}${Urls.football.fixtureLineup}`,
      { params: { fixtureId } },
    );
    return response.data.response[0];
  } catch (error: any) {
    return rejectWithValue(
      error.response ? error.response.data : error.message,
    );
  }
});

export const fetchFixtureEvents = createAsyncThunk<
  FixtureEventResponse,
  number,
  { rejectValue: string }
>('fixture/fetchEvents', async (fixtureId: number, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${Urls.apiUrl}${Urls.football.fixtureEvents}`,
      { params: { fixtureId } },
    );
    return response.data.response[0];
  } catch (error: any) {
    return rejectWithValue(
      error.response ? error.response.data : error.message,
    );
  }
});
