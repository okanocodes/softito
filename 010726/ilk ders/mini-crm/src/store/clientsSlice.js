import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async Thunks
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Müşteriler yüklenemedi.');
    }
  }
);

export const addClient = createAsyncThunk(
  'clients/addClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await api.post('/clients', {
        ...clientData,
        createdAt: new Date().toISOString(),
        avatar: clientData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Müşteri eklenemedi.');
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/clients/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Müşteri güncellenemedi.');
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/clients/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Müşteri silinemedi.');
    }
  }
);

const initialState = {
  clients: [],
  selectedClient: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    selectClient: (state, action) => {
      state.selectedClient = state.clients.find(c => c.id === action.payload) || null;
    },
    clearSelectedClient: (state) => {
      state.selectedClient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // addClient
      .addCase(addClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients.push(action.payload);
      })
      .addCase(addClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // updateClient
      .addCase(updateClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.clients.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.selectedClient && state.selectedClient.id === action.payload.id) {
          state.selectedClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // deleteClient
      .addCase(deleteClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = state.clients.filter(c => c.id !== action.payload);
        if (state.selectedClient && state.selectedClient.id === action.payload) {
          state.selectedClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { selectClient, clearSelectedClient } = clientsSlice.actions;
export default clientsSlice.reducer;
