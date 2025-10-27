import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ role, children }) => {
  const { user, loading, fetchProfile } = useAuth(role);

  // ✅ Only fetch profile once
  useEffect(() => {
    if (typeof fetchProfile === 'function') fetchProfile();
  }, [fetchProfile]);

  // ✅ Wait until loading finishes
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // ✅ Only redirect if user is definitively not logged in
  if (!user) {
    return <Navigate to={`/${role}/login`} replace />;
  }

  // ✅ Redirect if logged-in user has a different role
  if (user.role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // ✅ Render children safely
  return <>{children}</>;
};

export default ProtectedRoute;
