import Urls from '@app/constants/Urls';
import { ApiResponse } from '@app/types/api';
import { League } from '@app/types/football';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchLeagueList = createAsyncThunk<League[]>(
  'league/fetchLeagueInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<League>>(
        Urls.domainUrl + Urls.football.leagues
      );
      if (
        response.data.response === null ||
        response.data.metaData.responseCode !== 200 ||
        !response.data.response
      ) {
        return rejectWithValue(response.data.metaData);
      }
      const leagueInfoArray = response.data.response;
      return leagueInfoArray;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export default fetchLeagueList;
