import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  selectedQuestionId: string | null;
  isPreviewMode: boolean;
  isDirty: boolean;
  dragItem: any | null;
}

const initialState: EditorState = {
  selectedQuestionId: null,
  isPreviewMode: false,
  isDirty: false,
  dragItem: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    selectQuestionInEditor(state, action: PayloadAction<string | null>) {
      state.selectedQuestionId = action.payload;
    },
    togglePreview(state) {
      state.isPreviewMode = !state.isPreviewMode;
    },
    setDirty(state, action: PayloadAction<boolean>) {
      state.isDirty = action.payload;
    },
    setDragItem(state, action: PayloadAction<any>) {
      state.dragItem = action.payload;
    },
    clearEditor(state) {
      state.selectedQuestionId = null;
      state.isPreviewMode = false;
      state.isDirty = false;
      state.dragItem = null;
    },
  },
});

export const {
  selectQuestionInEditor,
  togglePreview,
  setDirty,
  setDragItem,
  clearEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
