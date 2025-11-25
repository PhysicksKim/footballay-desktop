import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetchFixtureList, {
  FixtureListItemResponse,
} from '@app/store/slices/select/list/fixtureListSliceThunk';

export interface FixtureListState {
  fixtures: FixtureListItemResponse[];
  lastFetchTime: string;
}

export const initialState: FixtureListState = {
  fixtures: [] as FixtureListItemResponse[],
  lastFetchTime: new Date().toISOString(),
};

const fixtureListSlice = createSlice({
  name: 'fixtureList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFixtureList.fulfilled, (state, action) => {
        if (action.payload.response === undefined) {
          return;
        }
        if (action.payload.response === null) {
          return;
        }
        state.fixtures = action.payload.response;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchFixtureList.rejected, (state, action) => {
        console.error('Error fetching fixture list:', action.payload);
      });
  },
});

export default fixtureListSlice.reducer;
