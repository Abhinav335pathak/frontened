import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Layout
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Public Pages
import Home from './pages/Home';
import MenuDetail from './pages/User/MenuDetail';
import OrderPage from './pages/User/OrderPage';

// Auth Pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// User
import UserProfile from './pages/User/Profile';
import UserOrders from './pages/User/Orders';
import UserDashboard from './components/Dashboard/UserDashboard';

// Restaurant
import RestaurantProfile from './pages/Restaurant/Profile';
import RestaurantManage from './pages/Restaurant/Manage';
import RestaurantDashboard from './components/Dashboard/RestaurantDashboard';
import RestaurantOrders from './pages/Restaurant/RestaurantOrder';

// Admin
import AdminProfile from './pages/Admin/Profile';
import AdminApprovals from './pages/Admin/Approvals';
import AdminDashboard from './components/Dashboard/AdminDashboard';

// Auth Helpers
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { healthCheck } from './services/api';

// Redirect if logged in
const RedirectIfLoggedIn = ({ role, children }) => {
  const currentRole = localStorage.getItem('role');
  if (currentRole === role) return <Navigate to={`/${role}/dashboard`} replace />;
  return children;
};

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  // Sync localStorage changes
  useEffect(() => {
    const handleStorageChange = () => setRole(localStorage.getItem('role') || null);
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Backend health check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await healthCheck();
        console.log('✅ Backend connected');
      } catch {
        toast.error('⚠️ Backend connection failed.');
      }
    };
    checkBackend();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header role={role} />
        <main className="flex-grow">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/menu/:id" element={<MenuDetail />} />
            <Route path="/order/:id" element={<OrderPage />} />

            {/* Auth */}
            <Route
              path="/user/login"
              element={<RedirectIfLoggedIn role="user"><Login role="user" /></RedirectIfLoggedIn>}
            />
            <Route
              path="/user/register"
              element={<RedirectIfLoggedIn role="user"><Register role="user" /></RedirectIfLoggedIn>}
            />
            <Route
              path="/restaurant/login"
              element={<RedirectIfLoggedIn role="restaurant"><Login role="restaurant" /></RedirectIfLoggedIn>}
            />
            <Route
              path="/restaurant/register"
              element={<RedirectIfLoggedIn role="restaurant"><Register role="restaurant" /></RedirectIfLoggedIn>}
            />
            <Route
              path="/admin/login"
              element={<RedirectIfLoggedIn role="admin"><Login role="admin" /></RedirectIfLoggedIn>}
            />
            <Route
              path="/admin/register"
              element={<RedirectIfLoggedIn role="admin"><Register role="admin" /></RedirectIfLoggedIn>}
            />

            {/* User */}
            <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/orders" element={<ProtectedRoute role="user"><UserOrders /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />

            {/* Restaurant */}
            <Route path="/restaurant/dashboard" element={<ProtectedRoute role="restaurant"><RestaurantDashboard /></ProtectedRoute>} />
            <Route path="/restaurant/manage" element={<ProtectedRoute role="restaurant"><RestaurantManage /></ProtectedRoute>} />
            <Route path="/restaurant/profile" element={<ProtectedRoute role="restaurant"><RestaurantProfile /></ProtectedRoute>} />
            <Route path="/restaurant/orders" element={<ProtectedRoute role="restaurant"><RestaurantOrders /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute role="admin"><AdminApprovals /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="/login" element={<Navigate to="/user/login" replace />} />
            <Route path="/register" element={<Navigate to="/user/register" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
