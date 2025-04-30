import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICoreState } from '../../interfaces/core';
import { IUser } from '../../interfaces/user';
import { ILocale } from '@/core/interfaces/locale';

export const CORE_SLICER = '@Core/Slicer';

// Initial State
const initialState: ICoreState = {
  user: null,
  locale: null,
};

// Slice
export const coreSlice = createSlice({
  name: CORE_SLICER,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      if (state.locale) {
        state.locale.language = action.payload;
      }
    },
    setLocale: (state, action: PayloadAction<ILocale>) => {
      state.locale = action.payload;
    },
    resetCoreState: () => initialState,
  },
});

// Actions
export const { setUser, clearUser, resetCoreState, setLanguage, setLocale } = coreSlice.actions;

// Reducer
export default coreSlice.reducer;
