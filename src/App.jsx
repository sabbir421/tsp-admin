import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardOverview from './pages/DashboardOverview';
import UsersPage from './pages/UsersPage';
import PropertiesPage from './pages/PropertiesPage';
import RequirementsPage from './pages/RequirementsPage';
import MatchesPage from './pages/MatchesPage';
import OtpLogsPage from './pages/OtpLogsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PageTitleWrapper({ children, title }) {
  return <AdminLayout title={title}>{children}</AdminLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="Executive Dashboard Overview">
                <DashboardOverview />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="User Directory Management">
                <UsersPage />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="Properties Approval & Management">
                <PropertiesPage />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/requirements"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="Buyer & Tenant Requirements Feed">
                <RequirementsPage />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="Matches & Site Visits Tracker">
                <MatchesPage />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/otp-logs"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="OTP & SMS Delivery Audit Logs">
                <OtpLogsPage />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="Admin Team Management & Credentials">
                <AdminUsersPage />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTitleWrapper title="System & Platform Configuration">
                <SettingsPage />
              </PageTitleWrapper>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
