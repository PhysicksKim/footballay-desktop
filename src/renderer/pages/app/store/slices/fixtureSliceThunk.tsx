import { createAsyncThunk } from '@reduxjs/toolkit';
import { Fixture } from '../../types/football';
import axios from 'axios';
import { ApiResponse } from '../../types/api';
import Urls from '../../common/Urls';

const fetchFixtureInfo = createAsyncThunk(
  'fixture/fetchFixtureInfo',
  async (fixtureId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<Fixture>>(
        Urls.apiUrl + '/api/football/fixtures',
        {
          params: { fixtureId },
        },
      );
      if (
        response.data.response === null ||
        response.data.metaData.responseCode !== 200 ||
        response.data.response?.length !== 1
      ) {
        return rejectWithValue(response.data.metaData);
      }
      const fixtureInfo = response.data.response[0];
      return fixtureInfo;
    } catch (error: any) {
      return rejectWithValue(
        error.response ? error.response.data : error.message,
      );
    }
  },
);

export default fetchFixtureInfo;
