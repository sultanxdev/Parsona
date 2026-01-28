import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ConnectAccount from './pages/ConnectAccount';
import CareerGoals from './pages/CareerGoals';
import AIDirection from './pages/AIDirection';
import Settings from './pages/Settings';
import AuthCallback from './pages/AuthCallback';
import Background from './components/Background';
import DashboardLayout from './components/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  console.log('[App] Rendering. Pathname:', window.location.pathname);
  console.log('[App] Search:', window.location.search);

  return (
    <AuthProvider>
      <Background>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Greedy Auth Catch-all */}
          <Route path="/auth/*" element={<AuthCallback />} />
          <Route path="/debug-route" element={<div>Debug Route Active</div>} />

          {/* Protected SaaS Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/connect" element={<ProtectedRoute><DashboardLayout><ConnectAccount /></DashboardLayout></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><DashboardLayout><CareerGoals /></DashboardLayout></ProtectedRoute>} />
          <Route path="/direction" element={<ProtectedRoute><DashboardLayout><AIDirection /></DashboardLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Background>
    </AuthProvider>
  );
}

export default App;
