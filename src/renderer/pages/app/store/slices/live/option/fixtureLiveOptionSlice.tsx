import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FixtureLiveOptionState {
  showPhoto: boolean;
}

const initialState: FixtureLiveOptionState = {
  /**
   * @deprecated 항상 선수 사진을 보여주도록 합니다. 삭제될 옵션입니다.
   */
  showPhoto: true,
};

const showPhotoSlice = createSlice({
  name: 'showPhoto',
  initialState,
  reducers: {
    setShowPhoto(state, action: PayloadAction<boolean>) {
      state.showPhoto = action.payload;
    },
  },
});

export const { setShowPhoto } = showPhotoSlice.actions;
export default showPhotoSlice.reducer;
