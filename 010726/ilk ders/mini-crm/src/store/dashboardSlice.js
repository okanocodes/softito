import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async Thunks
export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Dashboard verileri yüklenemedi.');
    }
  }
);

export const addTask = createAsyncThunk(
  'dashboard/addTask',
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentTasks = state.dashboard.upcomingTasks || [];
      const newTask = {
        id: 't_' + Date.now(),
        ...taskData
      };
      const updatedTasks = [...currentTasks, newTask];
      const response = await api.patch('/dashboard', { upcomingTasks: updatedTasks });
      return response.data.upcomingTasks;
    } catch (err) {
      return rejectWithValue(err.message || 'Görev eklenemedi.');
    }
  }
);

export const completeTask = createAsyncThunk(
  'dashboard/completeTask',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentTasks = state.dashboard.upcomingTasks || [];
      const updatedTasks = currentTasks.filter(t => t.id !== taskId);
      const response = await api.patch('/dashboard', { upcomingTasks: updatedTasks });
      return response.data.upcomingTasks;
    } catch (err) {
      return rejectWithValue(err.message || 'Görev silinemedi.');
    }
  }
);

export const addRecentActivityPersistent = createAsyncThunk(
  'dashboard/addRecentActivityPersistent',
  async (activityData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentActivities = state.dashboard.recentActivity || [];
      const newActivity = {
        id: 'a_' + Date.now(),
        timestamp: new Date().toISOString(),
        ...activityData
      };
      // Keep only last 5 activities
      const updatedActivities = [newActivity, ...currentActivities].slice(0, 5);
      const response = await api.patch('/dashboard', { recentActivity: updatedActivities });
      return response.data.recentActivity;
    } catch (err) {
      return rejectWithValue(err.message || 'Aktivite kaydedilemedi.');
    }
  }
);

const initialState = {
  stats: null,
  recentActivity: [],
  upcomingTasks: [],
  revenueChart: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity || [];
        state.upcomingTasks = action.payload.upcomingTasks || [];
        state.revenueChart = action.payload.revenueChart || [];
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.upcomingTasks = action.payload;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.upcomingTasks = action.payload;
      })
      .addCase(addRecentActivityPersistent.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      });
  }
});

export default dashboardSlice.reducer;

