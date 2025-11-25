import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface ColorOptionState {
  useAlternativeColorStrategy: boolean;
  isLoaded: boolean;
}

const initialState: ColorOptionState = {
  useAlternativeColorStrategy: true, // 기본값: 대안 색상 선택 전략 사용
  isLoaded: false,
};

// Electron Store에서 옵션 로드
export const loadColorOption = createAsyncThunk(
  'colorOption/load',
  async () => {
    try {
      const value = await (window as any).electron?.ipcRenderer?.invoke(
        'get-store-value',
        'matchlive.color.useAlternativeColorStrategy'
      );
      // 저장된 값이 없으면 기본값 true 반환
      return value !== undefined ? value : true;
    } catch (e) {
      console.error('Failed to load colorOption:', e);
      return true;
    }
  }
);

// Electron Store에 옵션 저장
export const saveColorOption = createAsyncThunk(
  'colorOption/save',
  async (value: boolean) => {
    try {
      await (window as any).electron?.ipcRenderer?.invoke(
        'set-store-value',
        'matchlive.color.useAlternativeColorStrategy',
        value
      );
      return value;
    } catch (e) {
      console.error('Failed to save colorOption:', e);
      return value;
    }
  }
);

const colorOptionSlice = createSlice({
  name: 'colorOption',
  initialState,
  reducers: {
    setUseAlternativeColorStrategy(state, action: PayloadAction<boolean>) {
      state.useAlternativeColorStrategy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadColorOption.fulfilled, (state, action) => {
        state.useAlternativeColorStrategy = action.payload;
        state.isLoaded = true;
      })
      .addCase(saveColorOption.fulfilled, (state, action) => {
        state.useAlternativeColorStrategy = action.payload;
      });
  },
});

export const { setUseAlternativeColorStrategy } = colorOptionSlice.actions;
export default colorOptionSlice.reducer;

