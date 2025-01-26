import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validatePreferenceKey } from './fixtureLiveOptionThunk';
import { loadPreferenceKey, persistPreferenceKey } from './preferenceKeyIO';

export interface FixtureLiveOptionState {
  showPhoto: boolean;
  /**
   * "속성키" 로 번역합니다.
   */
  preference: {
    key: string;
    isValid: boolean;
    status: 'idle' | 'loading' | 'success' | 'failed';
  };
}

const initialState: FixtureLiveOptionState = {
  /**
   * @deprecated 항상 선수 사진을 보여주도록 합니다. 삭제될 옵션입니다.
   */
  showPhoto: true,
  preference: {
    key: '',
    isValid: false,
    status: 'idle',
  },
};

const optionSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setShowPhoto(state, action: PayloadAction<boolean>) {
      state.showPhoto = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validatePreferenceKey.pending, (state) => {
        state.preference.status = 'loading';
      })
      .addCase(
        validatePreferenceKey.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          const validationResult = action.payload;
          state.preference.isValid = validationResult;
          state.preference.status = 'success';
        },
      )
      .addCase(validatePreferenceKey.rejected, (state, action) => {
        state.preference.isValid = false;
        state.preference.status = 'failed';
      })
      .addCase(loadPreferenceKey.fulfilled, (state, action) => {
        state.preference.key = action.payload.key;
        state.preference.isValid = action.payload.isValid;
      })
      .addCase(persistPreferenceKey.fulfilled, (state, action) => {
        state.preference.key = action.payload;
      });
  },
});

export const { setShowPhoto } = optionSlice.actions;
export default optionSlice.reducer;
