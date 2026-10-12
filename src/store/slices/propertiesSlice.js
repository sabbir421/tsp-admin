import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';

export const fetchProperties = createAsyncThunk('properties/fetchProperties', async (params, { rejectWithValue }) => {
  try {
    const res = await adminApi.getProperties(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch properties');
  }
});

export const updatePropStatus = createAsyncThunk('properties/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await adminApi.updatePropertyStatus(id, status);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update property status');
  }
});

export const deleteProp = createAsyncThunk('properties/deleteProp', async (id, { rejectWithValue }) => {
  try {
    await adminApi.deleteProperty(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete property');
  }
});

const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePropStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteProp.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export default propertiesSlice.reducer;
