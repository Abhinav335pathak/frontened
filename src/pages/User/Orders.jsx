import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Layout/Sidebar';
import Button from '../../components/UI/Button';
import { orderApi } from '../../services/api';
import { ShoppingCart, Clock, CheckCircle, XCircle, Filter, Star, Truck, ChefHat, MapPin, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserOrders = () => {
  const { user, loading: authLoading } = useAuth('user');
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getUserOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const handleReorder = async (orderId) => {
    try {
      const order = orders.find(o => o._id === orderId);
      if (!order) return;

      const reorderData = {
        userId: user._id,
        restaurantId: order.restaurantId?._id || order.restaurantId,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: order.totalPrice,
        status: 'pending',
        paymentMethod: order.paymentMethod
      };

      await orderApi.create(reorderData);
      toast.success('Order placed successfully! 🎉');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to place reorder');
    }
  };

  const handleRate = async (orderId, rating) => {
    try {
      await orderApi.rateOrder(orderId, { rating });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, rating } : order
      ));
      toast.success(`Rated ${rating} stars! ⭐`);
    } catch (error) {
      console.error('Error rating order:', error);
      toast.error('Failed to submit rating');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        icon: Clock, 
        color: 'text-amber-500', 
        bgColor: 'bg-amber-50', 
        borderColor: 'border-amber-200',
        label: 'Preparing' 
      },
      confirmed: { 
        icon: ChefHat, 
        color: 'text-blue-500', 
        bgColor: 'bg-blue-50', 
        borderColor: 'border-blue-200',
        label: 'Confirmed' 
      },
      'out for delivery': { 
        icon: Truck, 
        color: 'text-purple-500', 
        bgColor: 'bg-purple-50', 
        borderColor: 'border-purple-200',
        label: 'On the Way' 
      },
      delivered: { 
        icon: CheckCircle, 
        color: 'text-emerald-500', 
        bgColor: 'bg-emerald-50', 
        borderColor: 'border-emerald-200',
        label: 'Delivered' 
      },
      cancelled: { 
        icon: XCircle, 
        color: 'text-rose-500', 
        bgColor: 'bg-rose-50', 
        borderColor: 'border-rose-200',
        label: 'Cancelled' 
      }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  if (authLoading) {
    return (
      <div className="flex">
        <Sidebar role="user" />
        <div className="ml-64 flex-1 p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="user" />
      <div className="ml-64 flex-1 p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-800 mb-2">My Orders</h1>
              <p className="text-gray-600">Track and manage your food orders</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { value: 'all', label: 'All Orders', count: orders.length },
              { value: 'pending', label: 'Preparing', count: orders.filter(o => o.status === 'pending').length },
              { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
              { value: 'out for delivery', label: 'On the Way', count: orders.filter(o => o.status === 'out for delivery').length },
              { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
              { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
            ].map((filterOption) => {
              const isActive = filter === filterOption.value;
              return (
                <button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 shadow-md hover:shadow-lg border border-slate-200'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {filterOption.label}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    isActive ? 'bg-white/20' : 'bg-slate-100'
                  }`}>
                    {filterOption.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-lg p-6 border border-slate-200 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-slate-200 rounded-lg w-48"></div>
                      <div className="h-4 bg-slate-200 rounded-lg w-32"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-lg w-full mb-4"></div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={order._id} 
                    className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-gray-800">
                              {order.restaurantId?.name || 'Restaurant'}
                            </h3>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
                              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                              <span className={`text-sm font-semibold ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Order #{order._id.slice(-8).toUpperCase()} • {formatTimeAgo(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-amber-600">₹{order.totalPrice}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-4">
                        <p className="text-gray-700 font-semibold mb-2">Items:</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                              <span>{item.quantity}x {item.name}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Tracking */}
                      {order.trackingDetails && (
                        <div className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-sm text-gray-700 font-semibold mb-1">Tracking:</p>
                          <p className="text-sm text-gray-600">{order.trackingDetails}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                        <Button 
                          onClick={() => handleReorder(order._id)}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Reorder
                        </Button>
                        
                        {order.status === 'delivered' && !order.rating && (
                          <div className="flex items-center gap-3 bg-amber-50 rounded-2xl px-4 py-2 border border-amber-200">
                            <span className="text-sm font-semibold text-gray-700">Rate your order:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRate(order._id, star)}
                                  className="text-2xl transition-all transform hover:scale-125"
                                >
                                  <Star 
                                    className={`w-6 h-6 ${
                                      star <= (order.rating || 0) 
                                        ? 'fill-amber-400 text-amber-400' 
                                        : 'text-gray-300 hover:text-amber-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {order.rating && (
                          <div className="flex items-center gap-2 bg-emerald-50 rounded-2xl px-4 py-2 border border-emerald-200">
                            <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-700">
                              Rated {order.rating} stars
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200">
              <ShoppingCart className="h-20 w-20 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-black text-gray-800 mb-3">No orders found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {filter === 'all' 
                  ? "You haven't placed any orders yet. Start exploring restaurants and place your first order!"
                  : `No ${filter} orders found. Try adjusting your filter.`
                }
              </p>
              {filter !== 'all' && (
                <Button
                  onClick={() => setFilter('all')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  View All Orders
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
