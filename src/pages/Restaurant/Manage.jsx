import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Layout/Sidebar';
import Button from '../../components/UI/Button';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { menuItemApi, orderApi, restaurantApi } from '../../services/api';

const RestaurantManage = () => {
  const { user, loading, fetchProfile } = useAuth('restaurant');
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'starter',
    imageUrl: ''
  });

  useEffect(() => {
    if (user) {
      setIsOpen(user.isActive ?? false);
      fetchMenu();
      fetchOrders();
    }
  }, [user]);

  // Fetch menu items
  const fetchMenu = async () => {
    try {
      const res = await menuItemApi.getAll(user?._id);
      const items = Array.isArray(res.data?.menuItems) ? res.data.menuItems : [];
      setMenu(items);
    } catch (err) {
      toast.error('Failed to fetch menu');
      console.error(err);
      setMenu([]);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await orderApi.getAll();
      const fetchedOrders = Array.isArray(res.data?.orders) ? res.data.orders : [];
      setOrders(fetchedOrders);
    } catch (err) {
      toast.error('Failed to fetch orders');
      console.error(err);
      setOrders([]);
    }
  };

  // Toggle restaurant open/closed
  const handleToggleStatus = async () => {
    try {
      const res = await restaurantApi.toggleStatus();
      const newStatus = res.data?.restaurant?.isActive ?? !isOpen;
      setIsOpen(newStatus);
      toast.success(newStatus ? 'Restaurant opened' : 'Restaurant closed');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to toggle restaurant status');
      console.error(err);
    }
  };

  // Handle menu item input change
  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Add new menu item


// Updated handleAddItem to upload file first, then create menu item
const handleAddItem = async (e) => {
  e.preventDefault();
  if (!newItem.name || !newItem.price) return toast.error('Please fill all fields');

  try {
    let imageUrl = newItem.imageUrl || '';

    if (newItem.imageFile) {
      const formData = new FormData();
      formData.append('file', newItem.imageFile); // ✅ only append the file

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`Upload failed: ${uploadRes.status} ${text}`);
      }

      const uploadBody = await uploadRes.json();
      imageUrl = uploadBody.secure_url; // ✅ Cloudinary secure URL
    }

    const createPayload = {
      ...newItem,
      price: parseFloat(newItem.price),
      imageUrl,
    };

    delete createPayload.imageFile;

    const res = await menuItemApi.create(createPayload);

    const createdItem = res?.data?.menuItem ?? res?.data;
    setMenu(prev => [...prev, createdItem]);
    toast.success('Menu item added');
    setNewItem({ name: '', description: '', price: '', category: 'starter', imageUrl: '', imageFile: null });
    setShowForm(false);
  } catch (err) {
    console.error(err);
    toast.error('Failed to add menu item');
  }
};



  // Update menu item status
  const handleUpdateMenuItem = async (id, newStatus) => {
    try {
      await menuItemApi.update(id, { status: newStatus });
      setMenu(menu.map(item => item._id === id ? { ...item, status: newStatus } : item));
      toast.success('Menu item updated');
    } catch (err) {
      toast.error('Failed to update menu item');
      console.error(err);
    }
  };

  // Update order status
  const handleOrderStatus = async (id, status) => {
    try {
      await orderApi.update(id, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 ml-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar role="restaurant" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Restaurant</h1>

          {/* Toggle Restaurant */}
          <div className="mb-8">
            <Button onClick={handleToggleStatus} variant={isOpen ? 'danger' : 'primary'} className="flex items-center">
              {isOpen ? <ToggleLeft className="h-4 w-4 mr-2" /> : <ToggleRight className="h-4 w-4 mr-2" />}
              {isOpen ? 'Close Restaurant' : 'Open Restaurant'}
            </Button>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Menu Items</h2>
              <Button onClick={() => setShowForm(!showForm)} variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>

           {showForm && (
  <form className="p-6 border-b" onSubmit={handleAddItem}>
    <div className="flex gap-4 flex-wrap items-center">
      <input type="text" name="name" placeholder="Item Name" value={newItem.name} onChange={handleMenuChange} className="border rounded px-3 py-1 flex-1" />
      <input type="text" name="description" placeholder="Description" value={newItem.description} onChange={handleMenuChange} className="border rounded px-3 py-1 flex-1" />
      <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleMenuChange} className="border rounded px-3 py-1 w-32" />
      <select name="category" value={newItem.category} onChange={handleMenuChange} className="border rounded px-3 py-1">
        <option value="starter">Starter</option>
        <option value="main course">Main Course</option>
        <option value="dessert">Dessert</option>
        <option value="drink">Drink</option>
      </select>

      {/* FILE INPUT */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setNewItem({ ...newItem, imageFile: e.target.files?.[0] })}
        className="border rounded px-3 py-1"
      />

      <Button type="submit" variant="primary">Add</Button>
    </div>
  </form>
)}

            <div className="divide-y">
              {Array.isArray(menu) && menu.map(item => (
                <div key={item._id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                  <select value={item.status || 'available'} onChange={e => handleUpdateMenuItem(item._id, e.target.value)} className="border rounded-lg px-3 py-1">
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            </div>
            <div className="divide-y">
              {Array.isArray(orders) && orders.map(order => (
                <div key={order._id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{order.userId?.name || 'Customer'}</h3>
                    <p className="text-gray-600">
                      {Array.isArray(order.items) ? order.items.map(i => `${i.name} x${i.quantity}`).join(', ') : 'No items'}
                    </p>
                    <p className="text-sm text-gray-500">Status: {order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹{order.totalPrice}</p>
                    <div className="mt-2 flex gap-2">
                      {order.status === 'Pending' && (
                        <>
                          <Button variant="success" size="sm" onClick={() => handleOrderStatus(order._id, 'Out for Delivery')}>Out for Delivery</Button>
                          <Button variant="danger" size="sm" onClick={() => handleOrderStatus(order._id, 'Cancelled')}>Cancel</Button>
                        </>
                      )}
                      {order.status === 'Out for Delivery' && (
                        <Button variant="success" size="sm" onClick={() => handleOrderStatus(order._id, 'Delivered')}>Mark Delivered</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!Array.isArray(orders) || orders.length === 0) && (
                <p className="p-6 text-gray-500">No orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManage;
