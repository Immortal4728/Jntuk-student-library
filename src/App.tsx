import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import HomePage from './pages/HomePage';
import MaterialsPage from './pages/MaterialsPage';
import SemesterListPage from './pages/SemesterListPage';
import SubjectsPage from './pages/SubjectsPage';
import FilesPage from './pages/FilesPage';
import ControlCenter from './pages/ControlCenter';
import AboutPage from './pages/AboutPage';
import StudentLoginPage from './pages/StudentLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardMaterialsPage from './pages/DashboardMaterialsPage';
import SavedMaterialsPage from './pages/SavedMaterialsPage';
import AcademicTrackerPage from './pages/AcademicTrackerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LoginModalProvider } from './context/LoginModalContext';

export default function App() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-login-modal'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AuthProvider>
      <LoginModalProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login/student" element={<StudentLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/materials/:branch" element={<SemesterListPage />} />
            <Route path="/materials/:branch/semester/:semesterNumber" element={<SubjectsPage />} />
            <Route path="/materials/:branch/semester/:semesterNumber/:subjectId" element={<FilesPage />} />
            <Route path="/control-center" element={<ControlCenter />} />
          </Route>

          {/* PROTECTED ROUTES (Dashboard Layout with Sidebar) */}
          <Route element={<DashboardLayout />}>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/materials" 
              element={
                <ProtectedRoute>
                  <DashboardMaterialsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/saved" 
              element={
                <ProtectedRoute>
                  <SavedMaterialsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/tracker" 
              element={
                <ProtectedRoute>
                  <AcademicTrackerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </LoginModalProvider>
    </AuthProvider>
  );
}
