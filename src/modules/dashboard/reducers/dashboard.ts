import { createSlice } from '@reduxjs/toolkit';
import { IDashboardState } from '../interfaces';

export const DASHBOARD_SLICER = '@Dashboard/Slicer';

const initialState: IDashboardState = {
  data: {
    employees: 0,
  },
};

const dashboardSlice = createSlice({
  name: DASHBOARD_SLICER,
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.data = action.payload;
    },
    resetDashboardState: () => initialState,
  },
});

export const { setDashboardData, resetDashboardState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
