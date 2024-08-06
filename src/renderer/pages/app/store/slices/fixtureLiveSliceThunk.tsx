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
