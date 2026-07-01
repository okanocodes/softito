import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clientsReducer from './clientsSlice';
import dashboardReducer from './dashboardSlice';
import settingsReducer from './settingsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
});

export default store;
