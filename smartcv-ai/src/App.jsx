import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResumeList from './components/resume/ResumeList';
import ResumeView from './components/resume/ResumeView';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-100 via-stone-50 to-emerald-50/30 text-stone-900 antialiased">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-lime-200/35 blur-[120px]" />
            <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-stone-200/40 blur-[110px]" />
          </div>
          <div className="relative z-10">
            <Navbar />
            <main className="pb-12 pt-4 sm:pt-6">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resumes"
                element={
                  <ProtectedRoute>
                    <ResumeList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resumes/:id"
                element={
                  <ProtectedRoute>
                    <ResumeView />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
