import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { menuItemApi, orderApi } from '../../services/api';
import Button from '../../components/UI/Button';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth('user'); // get logged-in user
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  // Fetch menu item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await menuItemApi.getById(id);
        setItem(res.data.menuItem);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load menu item');
      }
    };
    fetchItem();
  }, [id]);

  // Handle placing the order
  const handleOrder = async () => {
    if (!user) return toast.error('Please login first');
    if (!item) return toast.error('Item not loaded yet');
    if (quantity < 1) return toast.error('Quantity must be at least 1');

    setLoading(true);
    try {
      const orderData = {
        userId: user._id,
        restaurantId: item.restaurantId,
        items: [{ name: item.name, quantity: Number(quantity), price: item.price }],
        totalPrice: item.price * quantity,
        status: 'Pending',
        paymentMethod,
      };

      await orderApi.create(orderData);
      toast.success(`Order placed: ${quantity} × ${item.name}`);
      navigate('/user/orders'); // optional: redirect to user's orders page
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Order {item.name}
        </h1>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Confirm Order'}
        </Button>
      </div>
    </section>
  );
};

export default OrderPage;
