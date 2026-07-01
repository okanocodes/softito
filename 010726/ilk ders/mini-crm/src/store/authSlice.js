import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate authentication by fetching the user profile from JSON server
      const response = await api.get('/user');
      const dbUser = response.data;
      
      // Basic simulation check: check if email is provided
      if (credentials.email && credentials.password) {
        // If they specify a different email than the db default, we'll temporarily update the name/email for realism
        let activeUser = dbUser;
        if (credentials.email !== dbUser.email) {
          activeUser = {
            ...dbUser,
            email: credentials.email,
            name: credentials.email.split('@')[0].replace('.', ' ')
          };
          // Persist this mock register/login state in server
          await api.put('/user', activeUser);
        }
        
        const token = 'mock-session-token-' + Math.random().toString(36).substring(2);
        localStorage.setItem('crm_token', token);
        localStorage.setItem('crm_user', JSON.stringify(activeUser));
        return { user: activeUser, token };
      }
      return rejectWithValue('Lütfen geçerli e-posta ve şifre giriniz.');
    } catch (err) {
      return rejectWithValue(err.message || 'Bağlantı hatası oluştu.');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Update the user profile on the mock database to simulate registry
      const newUser = {
        id: 'u1',
        name: userData.name,
        email: userData.email,
        jobTitle: userData.jobTitle || 'Satış Müdürü',
        avatar: userData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        role: 'admin'
      };
      
      const response = await api.put('/user', newUser);
      const token = 'mock-session-token-' + Math.random().toString(36).substring(2);
      
      localStorage.setItem('crm_token', token);
      localStorage.setItem('crm_user', JSON.stringify(response.data));
      
      return { user: response.data, token };
    } catch (err) {
      return rejectWithValue(err.message || 'Kayıt esnasında bir hata oluştu.');
    }
  }
);

const savedToken = localStorage.getItem('crm_token');
const savedUser = localStorage.getItem('crm_user');

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Action
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register Action
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
