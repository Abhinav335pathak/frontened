import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Layout/Sidebar';
import { Shield, User, Mail, Phone, Loader2 } from 'lucide-react';

const AdminProfile = () => {
  const { user, loading, fetchProfile } = useAuth('admin');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfileLoading(true);
      fetchProfile().finally(() => setProfileLoading(false));
    }
  }, [fetchProfile, user]);

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-64 ml-64">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Profile</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-8">
              <Shield className="h-16 w-16 text-orange-500 mr-4" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{user?.name || 'Admin User'}</h2>
                <p className="text-gray-600">Admin ID: {user?.id || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 flex items-center"><User className="h-5 w-5 mr-2" /> Name: {user?.name || 'N/A'}</p>
                <p className="text-gray-600 mt-2 flex items-center"><Mail className="h-5 w-5 mr-2" /> Email: {user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 flex items-center"><Phone className="h-5 w-5 mr-2" /> Phone: {user?.phone || 'N/A'}</p>
                <p className="text-gray-600 mt-2">Role: Admin</p>
              </div>
            </div>
            <p className="mt-6 text-gray-500">As an admin, you have access to manage users and restaurants. Contact support for updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;