import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async Thunks
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Ayarlar yüklenemedi.');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      // Use PATCH to update settings structure
      const response = await api.patch('/settings', settingsData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Ayarlar güncellenemedi.');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'settings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Update nested profile in settings via PATCH /settings
      const response = await api.patch('/settings', { profile: profileData });
      // Also update the /user endpoint to keep user profile in sync
      await api.patch('/user', profileData);
      return response.data.profile;
    } catch (err) {
      return rejectWithValue(err.message || 'Profil güncellenemedi.');
    }
  }
);

const initialState = {
  profile: null,
  notifications: null,
  preferences: null,
  team: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchSettings
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload.profile;
        state.notifications = action.payload.notifications;
        state.preferences = action.payload.preferences;
        state.team = action.payload.team;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // updateSettings
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload.profile;
        state.notifications = action.payload.notifications;
        state.preferences = action.payload.preferences;
        state.team = action.payload.team;
      })
      // updateProfile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
        // Update user storage cache if this profile is the current logged-in user
        const cachedUser = localStorage.getItem('crm_user');
        if (cachedUser) {
          const userObj = JSON.parse(cachedUser);
          const updatedUserObj = {
            ...userObj,
            name: action.payload.name,
            email: action.payload.email,
            phone: action.payload.phone,
            jobTitle: action.payload.jobTitle,
            avatar: action.payload.avatar
          };
          localStorage.setItem('crm_user', JSON.stringify(updatedUserObj));
        }
      });
  }
});

export default settingsSlice.reducer;
