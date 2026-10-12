import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getStats();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch stats');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: {
      totalUsers: 0,
      totalSellers: 0,
      totalBuyers: 0,
      totalProperties: 0,
      pendingProperties: 0,
      verifiedProperties: 0,
      matchedProperties: 0,
      totalRequirements: 0,
      totalMatches: 0,
      acceptedMatches: 0,
      completedVisits: 0,
      totalOtps: 0,
    },
    recentActivities: {
      properties: [],
      requirements: [],
      matches: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics || state.metrics;
        state.recentActivities = action.payload.recentActivities || state.recentActivities;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
