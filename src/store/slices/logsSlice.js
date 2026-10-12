import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';

export const fetchOtpLogs = createAsyncThunk('logs/fetchOtpLogs', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getOtpLogs();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch OTP logs');
  }
});

const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    otpLogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtpLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtpLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.otpLogs = action.payload || [];
      })
      .addCase(fetchOtpLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default logsSlice.reducer;
