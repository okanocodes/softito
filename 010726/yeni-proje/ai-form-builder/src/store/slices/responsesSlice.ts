import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface ResponseModel {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submittedAt: string;
  browser: string;
  device: string;
  country: string;
}

interface ResponsesState {
  items: ResponseModel[];
  selectedResponse: ResponseModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ResponsesState = {
  items: [],
  selectedResponse: null,
  status: 'idle',
  error: null,
};

export const fetchResponses = createAsyncThunk('responses/fetchResponses', async (formId: string, { rejectWithValue }) => {
  try {
    const response = await axios.get<ResponseModel[]>(`${API_URL}/responses?formId=${formId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Yanıtlar yüklenemedi');
  }
});

export const submitResponse = createAsyncThunk('responses/submitResponse', async (responseData: Omit<ResponseModel, 'id' | 'submittedAt' | 'browser' | 'device' | 'country'>, { rejectWithValue }) => {
  try {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';

    let device = 'Desktop';
    if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';

    // Random country simulation
    const countries = ['Turkey', 'United States', 'Germany', 'United Kingdom', 'France', 'Netherlands'];
    const country = countries[Math.floor(Math.random() * countries.length)];

    const newResponse = {
      ...responseData,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      browser,
      device,
      country,
    };
    const response = await axios.post<ResponseModel>(`${API_URL}/responses`, newResponse);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Cevap gönderilemedi');
  }
});

export const deleteResponse = createAsyncThunk('responses/deleteResponse', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/responses/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Yanıt silinemedi');
  }
});

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    selectResponse(state, action) {
      state.selectedResponse = state.items.find(item => item.id === action.payload) || null;
    },
    clearSelectedResponse(state) {
      state.selectedResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchResponses
      .addCase(fetchResponses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchResponses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // submitResponse
      .addCase(submitResponse.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // deleteResponse
      .addCase(deleteResponse.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedResponse?.id === action.payload) {
          state.selectedResponse = null;
        }
      });
  },
});

export const { selectResponse, clearSelectedResponse } = responsesSlice.actions;
export default responsesSlice.reducer;
