import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import formsReducer from './slices/formsSlice';
import questionsReducer from './slices/questionsSlice';
import responsesReducer from './slices/responsesSlice';
import editorReducer from './slices/editorSlice';
import aiReducer from './slices/aiSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
    questions: questionsReducer,
    responses: responsesReducer,
    editor: editorReducer,
    ai: aiReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
