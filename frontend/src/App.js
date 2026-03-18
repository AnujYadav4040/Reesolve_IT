import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import MyTickets from './pages/MyTickets';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminTickets from './pages/AdminTickets';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminTechnicians from './pages/AdminTechnicians';
import AdminUsers from './pages/AdminUsers';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'technician') return <Navigate to="/technician/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/tickets/new" element={
            <ProtectedRoute roles={['user']}>
              <CreateTicket />
            </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            <ProtectedRoute roles={['user']}>
              <MyTickets />
            </ProtectedRoute>
          } />
          <Route path="/tickets/:id" element={
            <ProtectedRoute roles={['user', 'technician', 'admin']}>
              <TicketDetail />
            </ProtectedRoute>
          } />

          {/* Technician Routes */}
          <Route path="/technician/dashboard" element={
            <ProtectedRoute roles={['technician']}>
              <TechnicianDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/tickets" element={
            <ProtectedRoute roles={['admin']}>
              <AdminTickets />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute roles={['admin']}>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/technicians" element={
            <ProtectedRoute roles={['admin']}>
              <AdminTechnicians />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
