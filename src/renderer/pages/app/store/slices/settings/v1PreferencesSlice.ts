import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@app/store/store';

type RequestState = 'idle' | 'loading' | 'saving' | 'error';

const DEFAULT_TIMEZONE = 'Asia/Seoul';

export interface V1PreferencesState {
  timezone: string;
  status: RequestState;
  error?: string;
}

const initialState: V1PreferencesState = {
  timezone: DEFAULT_TIMEZONE,
  status: 'idle',
};

export const loadV1Preferences = createAsyncThunk(
  'settings/v1Preferences/load',
  async () => {
    try {
      const timezone = await window.electronStore.get('settings.timezone');
      if (typeof timezone === 'string' && timezone.trim().length > 0) {
        return timezone.trim();
      }
      return DEFAULT_TIMEZONE;
    } catch (error) {
      console.error('Failed to load v1 preferences', error);
      return DEFAULT_TIMEZONE;
    }
  }
);

export const updateTimezonePreference = createAsyncThunk(
  'settings/v1Preferences/updateTimezone',
  async (timezone: string) => {
    const trimmed = timezone.trim() || DEFAULT_TIMEZONE;
    await window.electronStore.set('settings.timezone', trimmed);
    return trimmed;
  }
);

const v1PreferencesSlice = createSlice({
  name: 'v1Preferences',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadV1Preferences.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadV1Preferences.fulfilled, (state, action) => {
        state.status = 'idle';
        state.timezone = action.payload;
      })
      .addCase(loadV1Preferences.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      })
      .addCase(updateTimezonePreference.pending, (state) => {
        state.status = 'saving';
        state.error = undefined;
      })
      .addCase(updateTimezonePreference.fulfilled, (state, action) => {
        state.status = 'idle';
        state.timezone = action.payload;
      })
      .addCase(updateTimezonePreference.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const v1PreferencesReducer = v1PreferencesSlice.reducer;

export const selectTimezone = (state: RootState) =>
  state.v1Preferences.timezone;
export const selectTimezoneStatus = (state: RootState) =>
  state.v1Preferences.status;

