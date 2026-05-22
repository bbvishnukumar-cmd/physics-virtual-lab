import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ExperimentPage from './pages/ExperimentPage';
import LabManualPage from './pages/LabManualPage';
import ProgressPage from './pages/ProgressPage';
import ExamModePage from './pages/ExamModePage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/experiment/:id" element={<ProtectedRoute><ExperimentPage /></ProtectedRoute>} />
        <Route path="/manual" element={<ProtectedRoute><LabManualPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><ExamModePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ProgressProvider>
            <AppRoutes />
          </ProgressProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
