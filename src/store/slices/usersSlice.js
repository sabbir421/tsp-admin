import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../api/adminApi';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    const res = await adminApi.getUsers(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch users');
  }
});

export const toggleUserStatus = createAsyncThunk('users/toggleUserStatus', async ({ role, id, data }, { rejectWithValue }) => {
  try {
    const res = await adminApi.updateUserStatus(role, id, data);
    return { role, id, user: res.data };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update user');
  }
});

export const deleteUserAccount = createAsyncThunk('users/deleteUser', async ({ role, id }, { rejectWithValue }) => {
  try {
    await adminApi.deleteUser(role, id);
    return { role, id };
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete user');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id && u.userRole === action.payload.role);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload.user };
        }
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => !(u.id === action.payload.id && u.userRole === action.payload.role));
      });
  },
});

export default usersSlice.reducer;
