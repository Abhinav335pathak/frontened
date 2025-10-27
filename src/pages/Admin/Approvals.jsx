import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Layout/Sidebar';
import Button from '../../components/UI/Button';
import { Shield, UtensilsCrossed, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services/api';

// Mock pending restaurants (API will override this)
const mockPendingRestaurants = [
  { id: 1, name: 'New Pizza Place', owner: 'John Doe', status: 'pending', images: [] },
  { id: 2, name: 'Burger Spot', owner: 'Jane Smith', status: 'pending', images: [] },
];

const AdminApprovals = () => {
  const { loading } = useAuth('admin');
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [approvalLoading, setApprovalLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setApprovalLoading(true);
        const res = await adminApi.pendingRestaurants();
        setPendingRestaurants(res.data.restaurants || mockPendingRestaurants);
      } catch (error) {
        toast.error('Failed to fetch pending restaurants');
        setPendingRestaurants(mockPendingRestaurants);
      } finally {
        setApprovalLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (_id) => {
    try {
      await adminApi.approve(_id);
      toast.success('Restaurant approved!');
      setPendingRestaurants(pendingRestaurants.filter(r => r._id !== id));
    } catch (error) {
      console.log(_id);
      toast.error('Approval failed');
    }
  };

  const handleReject = async (_id) => {
    try {
      await adminApi.reject(_id);
      toast.success('Restaurant rejected!');
      setPendingRestaurants(pendingRestaurants.filter(r => r._id !== _id));
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  if (loading || approvalLoading) {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurant Approvals</h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Pending Restaurants</h2>
              <p className="text-gray-600 mt-1">{pendingRestaurants.length} restaurants awaiting approval</p>
            </div>
            <div className="divide-y">
              {pendingRestaurants.length > 0 ? (
                pendingRestaurants.map((restaurant) => (
                  <div key={restaurant._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                      <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
                      <p className="text-gray-600">Owner: {restaurant.owner}</p>
                      {restaurant.images.length > 0 && (
                        <img src={restaurant.images[0]} alt={restaurant.name} className="mt-2 h-16 w-16 object-cover rounded" />
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleApprove(restaurant._id)} variant="primary" size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button onClick={() => handleReject(restaurant._id)} variant="danger" size="sm">
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No pending restaurants at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;