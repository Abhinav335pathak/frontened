import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../Layout/Sidebar';
import Button from '../UI/Button';
import { Shield, Users, UtensilsCrossed, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services/api';

// Mock stats (replace with real API calls later)
const mockStats = {
  totalUsers: 1500,
  totalRestaurants: 250,
  pendingRestaurants: 5,
  approvedThisWeek: 20,
};

const AdminDashboard = () => {
  const { user, loading } = useAuth('admin');
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setStatsLoading(true);
        const res = await adminApi.pendingRestaurants();
        setPendingRestaurants(res.data.restaurants || []);  // Assume response: { restaurants: [...] }
      } catch (error) {
        toast.error('Failed to fetch pending restaurants');
        // Fallback to mock
        setPendingRestaurants([{ id: 1, name: 'Mock Pending', owner: 'Test' }]);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchPending();
  }, []);

  if (loading) {
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard - Welcome, {user?.name}</h1>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold text-gray-800">{mockStats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <UtensilsCrossed className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="text-lg font-semibold">Total Restaurants</h3>
              <p className="text-2xl font-bold text-gray-800">{mockStats.totalRestaurants}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="text-lg font-semibold">Approved This Week</h3>
              <p className="text-2xl font-bold text-gray-800">{mockStats.approvedThisWeek}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <XCircle className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="text-lg font-semibold">Pending Approvals</h3>
              <p className="text-2xl font-bold text-gray-800">
                {statsLoading ? <Loader2 className="h-5 w-5 animate-spin inline ml-1" /> : pendingRestaurants.length}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Button variant="primary" className="w-full py-4 text-lg">
              <Users className="h-5 w-5 mr-2" /> View All Users
            </Button>
            <Button variant="secondary" className="w-full py-4 text-lg">
              <UtensilsCrossed className="h-5 w-5 mr-2" /> Manage Restaurants
            </Button>
          </div>

          {/* Recent Pending Restaurants (Teaser) */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Recent Pending Restaurants</h2>
              <p className="text-gray-600 mt-1">Click to approve/reject</p>
            </div>
            <div className="divide-y">
              {statsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p>Loading pending...</p>
                </div>
              ) : pendingRestaurants.length > 0 ? (
                pendingRestaurants.slice(0, 3).map((restaurant) => (
                  <div key={restaurant.id} className="p-6 hover:bg-gray-50 transition flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
                      <p className="text-gray-600">Owner: {restaurant.owner}</p>
                    </div>
                    <Button variant="ghost" size="sm" as="Link" to="/admin/approvals">
                      Review
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No pending restaurants. All good!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
