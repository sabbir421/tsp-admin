import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';

export const fetchAdmins = createAsyncThunk('admins/fetchAdmins', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getAdmins();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch admin team');
  }
});

export const createNewAdmin = createAsyncThunk('admins/createAdmin', async (data, { rejectWithValue }) => {
  try {
    const res = await adminApi.createAdmin(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create admin');
  }
});

export const removeAdmin = createAsyncThunk('admins/removeAdmin', async (id, { rejectWithValue }) => {
  try {
    await adminApi.deleteAdmin(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete admin');
  }
});

const adminsSlice = createSlice({
  name: 'admins',
  initialState: {
    list: [],
    loading: false,
    submitting: false,
    error: null,
    submitError: null,
  },
  reducers: {
    clearAdminErrors: (state) => {
      state.error = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewAdmin.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(createNewAdmin.fulfilled, (state, action) => {
        state.submitting = false;
        state.list.unshift(action.payload);
      })
      .addCase(createNewAdmin.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      })
      .addCase(removeAdmin.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearAdminErrors } = adminsSlice.actions;
export default adminsSlice.reducer;
