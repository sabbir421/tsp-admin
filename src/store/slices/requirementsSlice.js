import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';

export const fetchRequirements = createAsyncThunk('requirements/fetchRequirements', async (params, { rejectWithValue }) => {
  try {
    const res = await adminApi.getRequirements(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch requirements');
  }
});

export const deleteReq = createAsyncThunk('requirements/deleteReq', async (id, { rejectWithValue }) => {
  try {
    await adminApi.deleteRequirement(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete requirement');
  }
});

const requirementsSlice = createSlice({
  name: 'requirements',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequirements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequirements.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchRequirements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReq.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
      });
  },
});

export default requirementsSlice.reducer;
