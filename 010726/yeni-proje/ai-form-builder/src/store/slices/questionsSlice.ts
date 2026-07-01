import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface QuestionModel {
  id: string;
  formId: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'rating';
  label: string;
  required: boolean;
  options?: string[];
}

interface QuestionsState {
  items: QuestionModel[];
  selectedQuestion: QuestionModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestionsState = {
  items: [],
  selectedQuestion: null,
  status: 'idle',
  error: null,
};

export const fetchQuestions = createAsyncThunk('questions/fetchQuestions', async (formId: string, { rejectWithValue }) => {
  try {
    const response = await axios.get<QuestionModel[]>(`${API_URL}/questions?formId=${formId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Sorular yüklenemedi');
  }
});

export const addQuestion = createAsyncThunk('questions/addQuestion', async (questionData: Omit<QuestionModel, 'id'>, { rejectWithValue }) => {
  try {
    const newQuestion = {
      ...questionData,
      id: Math.random().toString(36).substr(2, 9),
    };
    const response = await axios.post<QuestionModel>(`${API_URL}/questions`, newQuestion);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Soru eklenemedi');
  }
});

export const updateQuestion = createAsyncThunk('questions/updateQuestion', async ({ id, data }: { id: string; data: Partial<QuestionModel> }, { rejectWithValue }) => {
  try {
    const response = await axios.patch<QuestionModel>(`${API_URL}/questions/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Soru güncellenemedi');
  }
});

export const deleteQuestion = createAsyncThunk('questions/deleteQuestion', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/questions/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Soru silinemedi');
  }
});

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    selectQuestion(state, action) {
      state.selectedQuestion = state.items.find(item => item.id === action.payload) || null;
    },
    clearSelectedQuestion(state) {
      state.selectedQuestion = null;
    },
    setLocalQuestions(state, action) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchQuestions
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // addQuestion
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateQuestion
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedQuestion?.id === action.payload.id) {
          state.selectedQuestion = action.payload;
        }
      })
      // deleteQuestion
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedQuestion?.id === action.payload) {
          state.selectedQuestion = null;
        }
      });
  },
});

export const { selectQuestion, clearSelectedQuestion, setLocalQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
