import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@app/store/store';

type RequestState = 'idle' | 'loading' | 'saving' | 'error';

export interface FeatureFlagsState {
  developerMode: boolean;
  status: RequestState;
  error?: string;
}

const initialState: FeatureFlagsState = {
  developerMode: false,
  status: 'idle',
};

export const loadFeatureFlags = createAsyncThunk(
  'featureFlags/load',
  async () => {
    try {
      const value = await window.electronStore.get('settings.developerMode');
      return Boolean(value);
    } catch (error) {
      console.error('Failed to load feature flags', error);
      return false;
    }
  }
);

export const updateDeveloperMode = createAsyncThunk(
  'featureFlags/updateDeveloperMode',
  async (nextValue: boolean) => {
    await window.electronStore.set('settings.developerMode', nextValue);
    return nextValue;
  }
);

const featureFlagsSlice = createSlice({
  name: 'featureFlags',
  initialState,
  reducers: {
    setDeveloperMode(state, action: PayloadAction<boolean>) {
      state.developerMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeatureFlags.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadFeatureFlags.fulfilled, (state, action) => {
        state.status = 'idle';
        state.developerMode = action.payload;
      })
      .addCase(loadFeatureFlags.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      })
      .addCase(updateDeveloperMode.pending, (state) => {
        state.status = 'saving';
        state.error = undefined;
      })
      .addCase(updateDeveloperMode.fulfilled, (state, action) => {
        state.status = 'idle';
        state.developerMode = action.payload;
      })
      .addCase(updateDeveloperMode.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const featureFlagsReducer = featureFlagsSlice.reducer;

export const selectDeveloperMode = (state: RootState) =>
  state.featureFlags.developerMode;
export const selectFeatureFlagStatus = (state: RootState) =>
  state.featureFlags.status;

export const { setDeveloperMode } = featureFlagsSlice.actions;

