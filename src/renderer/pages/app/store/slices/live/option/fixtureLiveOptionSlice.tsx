import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FixtureLiveOptionState {
  showPhoto: boolean;
}

const initialState: FixtureLiveOptionState = {
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
