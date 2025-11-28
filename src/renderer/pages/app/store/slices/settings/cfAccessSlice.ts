import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@app/store/store';
import axios from 'axios';
import { V1Urls } from '@app/constants/V1Urls';

type RequestState = 'idle' | 'loading' | 'saving' | 'success' | 'error';

export interface CfAccessState {
  clientId: string;
  clientSecret: string;
  status: RequestState;
  error?: string;
}

const initialState: CfAccessState = {
  clientId: '',
  clientSecret: '',
  status: 'idle',
};

export const loadCfAccessCredentials = createAsyncThunk(
  'settings/cfAccess/load',
  async () => {
    try {
      const clientId = await window.electronStore.get(
        'settings.cfAccess.clientId'
      );
      const clientSecret = await window.electronStore.get(
        'settings.cfAccess.clientSecret'
      );

      return {
        clientId: typeof clientId === 'string' ? clientId : '',
        clientSecret: typeof clientSecret === 'string' ? clientSecret : '',
      };
    } catch (error) {
      console.error('Failed to load CF Access credentials', error);
      return { clientId: '', clientSecret: '' };
    }
  }
);

export const saveCfAccessCredentials = createAsyncThunk(
  'settings/cfAccess/save',
  async (credentials: { clientId: string; clientSecret: string }) => {
    // 1. 입력된 credentials로 health 엔드포인트 검증
    // dev 서버: https://dev.footballay.com/health (/api prefix 없음)
    const healthUrl = `${V1Urls.domainUrl}/health`;
    const response = await axios.get(healthUrl, {
      headers: {
        'CF-Access-Client-Id': credentials.clientId,
        'CF-Access-Client-Secret': credentials.clientSecret,
      },
      timeout: 5000,
    });

    // 2. 200 응답이면 electron store에 저장
    if (response.status === 200) {
      await window.electronStore.set(
        'settings.cfAccess.clientId',
        credentials.clientId
      );
      await window.electronStore.set(
        'settings.cfAccess.clientSecret',
        credentials.clientSecret
      );
      return credentials;
    }

    throw new Error('Invalid credentials');
  }
);

const cfAccessSlice = createSlice({
  name: 'cfAccess',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCfAccessCredentials.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadCfAccessCredentials.fulfilled, (state, action) => {
        state.status = 'idle';
        state.clientId = action.payload.clientId;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(loadCfAccessCredentials.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      })
      .addCase(saveCfAccessCredentials.pending, (state) => {
        state.status = 'saving';
        state.error = undefined;
      })
      .addCase(saveCfAccessCredentials.fulfilled, (state, action) => {
        state.status = 'success';
        state.clientId = action.payload.clientId;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(saveCfAccessCredentials.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const cfAccessReducer = cfAccessSlice.reducer;

export const selectCfAccessClientId = (state: RootState) =>
  state.cfAccess.clientId;
export const selectCfAccessClientSecret = (state: RootState) =>
  state.cfAccess.clientSecret;
export const selectCfAccessStatus = (state: RootState) => state.cfAccess.status;
