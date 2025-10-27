import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Layout/Sidebar';
import Button from '../../components/UI/Button';
import { ShoppingCart, Clock, CheckCircle, XCircle, Filter, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock orders data (replace with API /api/user/orders later)
const mockOrders = [
  { 
    id: 1, 
    restaurant: 'Pizza Palace', 
    items: 'Margherita Pizza x2, Garlic Bread', 
    status: 'delivered', 
    time: '2024-01-15 18:30', 
    price: 25.99, 
    rating: 5,
    tracking: 'Delivered to 123 Main St'
  },
  { 
    id: 2, 
    restaurant: 'Burger Hub', 
    items: 'Cheeseburger Combo', 
    status: 'pending', 
    time: '2024-01-15 19:00', 
    price: 15.50, 
    rating: null,
    tracking: 'Preparing...'
  },
  { 
    id: 3, 
    restaurant: 'Sushi Spot', 
    items: 'California Roll x1', 
    status: 'cancelled', 
    time: '2024-01-14 20:00', 
    price: 18.00, 
    rating: null,
    tracking: 'Cancelled by user'
  },
];

const UserOrders = () => {
  const { user, loading } = useAuth('user');
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');  // all, pending, delivered, cancelled

  useEffect(() => {
    // Fetch orders (mock for now)
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  const handleReorder = (orderId) => {
    toast.success(`Reordering order #${orderId}`);
    // Call API /api/orders/reorder later
  };

  const handleRate = (orderId, rating) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, rating } : o));
    toast.success(`Rated ${rating} stars!`);
    // Call API /api/orders/rate later
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 ml-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="user" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
          
          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-8">
            {['all', 'pending', 'delivered', 'cancelled'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(status)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredOrders.length > 0 ? (
              <div className="divide-y">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{order.restaurant}</h3>
                        <p className="text-gray-600 mb-2">{order.items}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          {getStatusIcon(order.status)}
                          <span className="ml-2">{order.status.toUpperCase()}</span>
                          <span className="ml-4">{order.tracking}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${order.price}</p>
                        <p className="text-sm text-gray-500">{order.time}</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 pt-2">
                      <Button onClick={() => handleReorder(order.id)} size="sm" variant="secondary">
                        Reorder
                      </Button>
                      {order.status === 'delivered' && order.rating === null && (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600 mr-2">Rate:</span>
                          {[1,2,3,4,5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRate(order.id, star)}
                              className={`text-2xl ${star <= (order.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
                <p className="text-gray-500">Try adjusting your filter or place a new order.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
