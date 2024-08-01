import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FixtureEventResponse, FixtureInfoResponse } from './matchLiveTypes';
import Urls from '@app/common/Urls';
import { ApiResponse } from '@app/types/api';

const fetchEvents = createAsyncThunk(
  'match/fetchEvents',
  async (fixtureId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<FixtureEventResponse>>(
        Urls.apiUrl + Urls.football.fixtureEvents,
        {
          params: {
            fixtureId,
          },
        },
      );
      return response.data.response;
    } catch (error) {
      return rejectWithValue('이벤트 데이터를 가져오는 데 실패했습니다.');
    }
  },
);

const fetchInfos = createAsyncThunk(
  'match/fetchInfos',
  async (fixtureId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<FixtureInfoResponse>>(
        Urls.apiUrl + Urls.football.fixtureInfo,
        {
          params: {
            fixtureId,
          },
        },
      );
      return response.data.response;
    } catch (err) {
      return rejectWithValue('정보 데이터를 가져오는 데 실패했습니다.');
    }
  },
);

export { fetchEvents, fetchInfos };
