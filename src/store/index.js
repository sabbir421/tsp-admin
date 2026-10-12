import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import usersReducer from './slices/usersSlice';
import propertiesReducer from './slices/propertiesSlice';
import requirementsReducer from './slices/requirementsSlice';
import matchesReducer from './slices/matchesSlice';
import logsReducer from './slices/logsSlice';
import adminsReducer from './slices/adminsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    properties: propertiesReducer,
    requirements: requirementsReducer,
    matches: matchesReducer,
    logs: logsReducer,
    admins: adminsReducer,
  },
});
