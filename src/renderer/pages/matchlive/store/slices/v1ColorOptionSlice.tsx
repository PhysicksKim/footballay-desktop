import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface V1ColorOptionState {
  useAlternativeColorStrategy: boolean;
  isLoaded: boolean;
}

const initialState: V1ColorOptionState = {
  useAlternativeColorStrategy: true, // 기본값: 대안 색상 선택 전략 사용
  isLoaded: false,
};

// Electron Store에서 옵션 로드
export const loadV1ColorOption = createAsyncThunk(
  'v1ColorOption/load',
  async () => {
    try {
      const value = await (window as any).electron?.ipcRenderer?.invoke(
        'get-store-value',
        'matchlive.v1.useAlternativeColorStrategy'
      );
      // 저장된 값이 없으면 기본값 true 반환
      return value !== undefined ? value : true;
    } catch (e) {
      console.error('Failed to load v1ColorOption:', e);
      return true;
    }
  }
);

// Electron Store에 옵션 저장
export const saveV1ColorOption = createAsyncThunk(
  'v1ColorOption/save',
  async (value: boolean) => {
    try {
      await (window as any).electron?.ipcRenderer?.invoke(
        'set-store-value',
        'matchlive.v1.useAlternativeColorStrategy',
        value
      );
      return value;
    } catch (e) {
      console.error('Failed to save v1ColorOption:', e);
      return value;
    }
  }
);

const v1ColorOptionSlice = createSlice({
  name: 'v1ColorOption',
  initialState,
  reducers: {
    setUseAlternativeColorStrategy(state, action: PayloadAction<boolean>) {
      state.useAlternativeColorStrategy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadV1ColorOption.fulfilled, (state, action) => {
        state.useAlternativeColorStrategy = action.payload;
        state.isLoaded = true;
      })
      .addCase(saveV1ColorOption.fulfilled, (state, action) => {
        state.useAlternativeColorStrategy = action.payload;
      });
  },
});

export const { setUseAlternativeColorStrategy } = v1ColorOptionSlice.actions;
export default v1ColorOptionSlice.reducer;

