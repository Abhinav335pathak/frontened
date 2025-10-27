import { useState, useEffect } from 'react';
import Sidebar from '../Layout/Sidebar';
import { ShoppingCart, Clock, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderApi } from '../../services/api';



const UserDashboard = () => {
  const [user, setUser] = useState({ name: 'Guest User' });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderApi.getAll();
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleReorder = async (order) => {
    try {
      await orderApi.create({
        restaurantId: order.restaurantId._id,
        items: order.items,
        totalPrice: order.totalPrice,
      });
      toast.success('Reordered successfully!');
    } catch (err) {
      toast.error('Failed to reorder');
    }
  };

  const handleRate = async (orderId, rating) => {
    try {
      await orderApi.update(orderId, { rating });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, rating } : o))
      );
      toast.success(`Rated ${rating} stars`);
    } catch (err) {
      toast.error('Failed to rate');
    }
  };

  if (loading) return <div className="flex justify-center mt-20">Loading...</div>;

  return (
    <div className="flex">
      <Sidebar role="user" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <ShoppingCart className="h-8 w-8 text-orange-500 mb-2" />
            <p>Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Clock className="h-8 w-8 text-orange-500 mb-2" />
            <p>Pending</p>
            <p className="text-2xl font-bold">{orders.filter(o => o.status==='Pending').length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <Star className="h-8 w-8 text-orange-500 mb-2" />
            <p>Average Rating</p>
            <p className="text-2xl font-bold">
              {orders.filter(o => o.rating).length ? (orders.filter(o=>o.rating).reduce((a,b)=>a+b.rating,0)/orders.filter(o=>o.rating).length).toFixed(1) : 0}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {orders.length ? orders.map(order => (
              <div key={order._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{order.restaurantId.name}</p>
                    <p className="text-gray-600">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${order.status==='Delivered'?'bg-green-100 text-green-800':'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                  <span>${order.totalPrice}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-orange-500 text-white rounded" onClick={()=>handleReorder(order)}>Reorder</button>
                  {order.status==='Delivered' && order.rating===null &&
                    [1,2,3,4,5].map(r => (
                      <button key={r} onClick={()=>handleRate(order._id,r)} className="text-yellow-400">★</button>
                    ))
                  }
                </div>
              </div>
            )) : <p className="p-6 text-gray-500 text-center">No orders yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
