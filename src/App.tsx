import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LoginModalProvider } from './context/LoginModalContext';

// Lazy-loaded routes for better performance (code-splitting)
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'));
const SemesterListPage = lazy(() => import('./pages/SemesterListPage'));
const SubjectsPage = lazy(() => import('./pages/SubjectsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ControlCenter = lazy(() => import('./pages/ControlCenter'));
const StudentLoginPage = lazy(() => import('./pages/StudentLoginPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DashboardMaterialsPage = lazy(() => import('./pages/DashboardMaterialsPage'));
const AcademicTrackerPage = lazy(() => import('./pages/AcademicTrackerPage'));
const ResultsHubPage = lazy(() => import('./pages/ResultsHubPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

// Minimal loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-label="Loading page">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );
}

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
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login/student" element={<StudentLoginPage />} />
              <Route path="/login/admin" element={<AdminLoginPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/materials/:branch" element={<SemesterListPage />} />
              <Route path="/materials/:branch/semester/:semesterNumber" element={<SubjectsPage />} />
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
                path="/dashboard/results" 
                element={
                  <ProtectedRoute>
                    <ResultsHubPage />
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
            </Route>

            {/* ADMIN ROUTE (standalone, no student sidebar) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </LoginModalProvider>
    </AuthProvider>
  );
}
