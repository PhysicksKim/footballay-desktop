import { createAsyncThunk } from '@reduxjs/toolkit';
import Urls from '@src/renderer/pages/app/constants/Urls';
import axios from 'axios';

export const validatePreferenceKey = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>(
  'options/validatePreferenceKey',
  async (preferencekey, { rejectWithValue }) => {
    try {
      console.log('validatePreferenceKey thunk key : ', preferencekey);
      const response = await axios.post(
        `${Urls.apiUrl}${Urls.football.preferenceKeyCheck()}`,
        {
          preferencekey: preferencekey,
        },
        {
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400,
        },
      );

      let isValid;
      if (response.status === 200) {
        isValid = true;
      } else if (response.status === 302) {
        isValid = false;
      } else {
        isValid = false;
      }
      await window.electronStore.set('preference.isValid', isValid);
      return isValid;
    } catch (error: any) {
      // 에러 메시지 로깅 등 추가 처리 가능
      return rejectWithValue(error.response?.data?.message || '키 검증 실패');
    }
  },
);
