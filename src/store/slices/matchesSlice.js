import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';

export const fetchMatches = createAsyncThunk('matches/fetchMatches', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getMatches();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch matches');
  }
});

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default matchesSlice.reducer;
