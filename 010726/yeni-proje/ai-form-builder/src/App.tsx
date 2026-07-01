import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHome from './pages/DashboardHome';
import FormsPage from './pages/FormsPage';
import NewFormPage from './pages/NewFormPage';
import EditorPage from './pages/EditorPage';
import SettingsPage from './pages/SettingsPage';
import SharePage from './pages/SharePage';
import ResponsesPage from './pages/ResponsesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TemplatesPage from './pages/TemplatesPage';
import AiPage from './pages/AiPage';
import AccountPage from './pages/AccountPage';
import BillingPage from './pages/BillingPage';
import TeamPage from './pages/TeamPage';
import NotificationsPage from './pages/NotificationsPage';
import TrashPage from './pages/TrashPage';
import PublicFormPage from './pages/PublicFormPage';
import FormSuccessPage from './pages/FormSuccessPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Marketing Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Public Form Rendering */}
        <Route path="/form/:shareId" element={<PublicFormPage />} />
        <Route path="/form/:shareId/success" element={<FormSuccessPage />} />

        {/* Dashboard Routes wrapped with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="forms" element={<FormsPage />} />
          <Route path="forms/new" element={<NewFormPage />} />
          <Route path="forms/:id/editor" element={<EditorPage />} />
          <Route path="forms/:id/settings" element={<SettingsPage />} />
          <Route path="forms/:id/share" element={<SharePage />} />
          <Route path="forms/:id/responses" element={<ResponsesPage />} />
          <Route path="forms/:id/analytics" element={<AnalyticsPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="ai" element={<AiPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="trash" element={<TrashPage />} />
        </Route>

        {/* Error handling */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
