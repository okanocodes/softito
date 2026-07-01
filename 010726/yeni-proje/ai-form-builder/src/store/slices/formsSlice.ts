import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface FormModel {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'published' | 'draft' | 'trash';
  shareId: string;
  theme: string;
  submitMessage: string;
  passwordProtection?: string;
  customDomain?: string;
}

interface FormsState {
  items: FormModel[];
  currentForm: FormModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FormsState = {
  items: [],
  currentForm: null,
  status: 'idle',
  error: null,
};

export const fetchForms = createAsyncThunk('forms/fetchForms', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<FormModel[]>(`${API_URL}/forms`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Formlar yüklenemedi');
  }
});

export const fetchForm = createAsyncThunk('forms/fetchForm', async (id: string, { rejectWithValue }) => {
  try {
    const response = await axios.get<FormModel>(`${API_URL}/forms/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Form bulunamadı');
  }
});

export const createForm = createAsyncThunk('forms/createForm', async (formData: Omit<FormModel, 'id' | 'createdAt'>, { rejectWithValue }) => {
  try {
    const newForm = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    const response = await axios.post<FormModel>(`${API_URL}/forms`, newForm);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Form oluşturulamadı');
  }
});

export const updateForm = createAsyncThunk('forms/updateForm', async ({ id, data }: { id: string; data: Partial<FormModel> }, { rejectWithValue }) => {
  try {
    const response = await axios.patch<FormModel>(`${API_URL}/forms/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Form güncellenemedi');
  }
});

export const deleteForm = createAsyncThunk('forms/deleteForm', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/forms/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Form silinemedi');
  }
});

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    clearCurrentForm(state) {
      state.currentForm = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchForms
      .addCase(fetchForms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // fetchForm
      .addCase(fetchForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentForm = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // createForm
      .addCase(createForm.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateForm
      .addCase(updateForm.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentForm?.id === action.payload.id) {
          state.currentForm = action.payload;
        }
      })
      // deleteForm
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentForm?.id === action.payload) {
          state.currentForm = null;
        }
      });
  },
});

export const { clearCurrentForm } = formsSlice.actions;
export default formsSlice.reducer;
