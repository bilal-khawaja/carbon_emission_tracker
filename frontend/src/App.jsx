import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import DailyEntryPage from './pages/DataEntryPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes - No Authentication Required */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin-Only Protected Routes */}
            <Route path="/settings" element={
              <ProtectedRoute adminOnly={true}>
                <SettingsPage />
              </ProtectedRoute>
            } />

            <Route path="/daily-entry" element={
              <ProtectedRoute adminOnly={true}>
                <DailyEntryPage />
              </ProtectedRoute>
            } />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
