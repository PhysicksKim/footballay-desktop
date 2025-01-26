import { createAsyncThunk } from '@reduxjs/toolkit';

export interface PreferenceOptions {
  key: string;
  isValid: boolean;
}

export const loadPreferenceKey = createAsyncThunk<PreferenceOptions, void>(
  'options/loadPreferenceKey',
  async () => {
    const savedKey = await window.electronStore.get('preference.key');
    const isValid = await window.electronStore.get('preference.isValid');
    return { key: savedKey, isValid };
  },
);

export const persistPreferenceKey = createAsyncThunk<string, string>(
  'options/persistPreferenceKey',
  async (newKey, thunkAPI) => {
    await window.electronStore.set('preference.key', newKey);
    return newKey;
  },
);
