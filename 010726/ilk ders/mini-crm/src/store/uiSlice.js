import { createSlice } from '@reduxjs/toolkit';

// Get initial theme preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('crm_theme');
  if (savedTheme) return savedTheme;
  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return userPrefersDark ? 'dark' : 'light';
};

const initialState = {
  theme: getInitialTheme(),
  sidebarCollapsed: false,
  clientModal: {
    isOpen: false,
    mode: null, // 'add' | 'edit' | 'delete'
    clientId: null
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleMode: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      localStorage.setItem('crm_theme', nextTheme);
    },
    setClientModal: (state, action) => {
      const { mode, clientId } = action.payload;
      state.clientModal.isOpen = true;
      state.clientModal.mode = mode;
      state.clientModal.clientId = clientId || null;
    },
    closeClientModal: (state) => {
      state.clientModal.isOpen = false;
      state.clientModal.mode = null;
      state.clientModal.clientId = null;
    }
  }
});

export const { toggleSidebar, toggleMode, setClientModal, closeClientModal } = uiSlice.actions;
export default uiSlice.reducer;
