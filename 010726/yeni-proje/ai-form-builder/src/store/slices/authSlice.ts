import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface User {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  avatar: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: localStorage.getItem('auth') === 'true',
  status: 'idle',
  error: null,
};

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<User>(`${API_URL}/user`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Kullanıcı bilgisi alınamadı');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials: { email: string }, { rejectWithValue }) => {
  try {
    // In json-server we have user as a single object. We'll fetch it and verify the email.
    const response = await axios.get<User>(`${API_URL}/user`);
    if (response.data.email.toLowerCase() === credentials.email.toLowerCase()) {
      return response.data;
    } else {
      return rejectWithValue('Geçersiz e-posta adresi');
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Giriş yapılamadı');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('auth');
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('auth', 'true');
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('auth');
      })
      // login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('auth', 'true');
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
