import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { menuItemApi, orderApi } from '../../services/api';
import Button from '../../components/UI/Button';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, Clock, Shield, Truck, Star, Heart, ShoppingBag } from 'lucide-react';

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth('user');
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [favorite, setFavorite] = useState(false);

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
      navigate('/user/orders');
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded-lg w-48 mx-auto"></div>
      </div>
    </div>
  );

  const totalPrice = item.price * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800">Complete Your Order</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Item Details Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 transform hover:shadow-2xl transition-all duration-300">
            <div className="relative">
              <img
                src={item.imageUrl || '/default-food.jpg'}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setFavorite(!favorite)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
              >
                <Heart 
                  className={`w-6 h-6 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`}
                />
              </button>
              <div className="absolute bottom-4 left-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-full font-black text-lg shadow-xl">
                ₹{item.price}
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-black text-gray-800 mb-3">{item.name}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {item.description || 'Crafted with premium ingredients and passion for exceptional taste.'}
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 rounded-full">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-gray-800 text-sm">4.5</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-700 text-sm">25-30 min</span>
                </div>
                {item.category && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 rounded-full">
                    <span className="font-semibold text-purple-700 text-sm capitalize">{item.category}</span>
                  </div>
                )}
              </div>

              {/* Restaurant Info */}
              <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-4 border border-slate-200">
                <h3 className="font-bold text-gray-800 mb-2">From {item.restaurantId?.name || 'Unknown Restaurant'}</h3>
                <p className="text-gray-600 text-sm">Premium restaurant • 4.8★ rating • Free delivery</p>
              </div>
            </div>
          </div>

          {/* Order Form Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-500" />
              Order Details
            </h3>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-12 h-12 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-gray-700 font-bold text-xl hover:from-slate-200 hover:to-slate-300 transition-all disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-2xl font-black text-gray-800 min-w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'card', label: '💳 Card', desc: 'Credit/Debit' },
                  { value: 'cod', label: '💰 Cash', desc: 'On Delivery' },
                  { value: 'upi', label: '📱 UPI', desc: 'PhonePe, GPay' },
                  { value: 'netbanking', label: '🏦 Net Banking', desc: 'Bank Transfer' }
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      paymentMethod === method.value
                        ? 'border-amber-500 bg-amber-50 shadow-lg transform scale-105'
                        : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <div className="font-bold text-gray-800 text-sm">{method.label}</div>
                    <div className="text-gray-600 text-xs">{method.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl p-4 mb-6 border border-amber-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Item Total ({quantity} items)</span>
                <span className="font-bold text-gray-800">₹{item.price * quantity}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Taxes</span>
                <span className="font-bold text-gray-800">₹{(item.price * quantity * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t border-amber-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-black text-amber-600">₹{(item.price * quantity * 1.05).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 mb-6 border border-emerald-200">
              <Truck className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-emerald-700 text-sm">Free Delivery</div>
                <div className="text-emerald-600 text-xs">Estimated delivery: 25-30 minutes</div>
              </div>
            </div>

            {/* Order Button */}
            <Button
              onClick={handleOrder}
              disabled={loading || !user}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Placing Order...
                </>
              ) : !user ? (
                'Please Login to Order'
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Confirm Order - ₹{totalPrice}
                </>
              )}
            </Button>

            {!user && (
              <p className="text-center text-gray-600 text-sm mt-3">
                <button 
                  onClick={() => navigate('/user/login')}
                  className="text-amber-600 hover:text-amber-700 font-semibold underline"
                >
                  Login
                </button> to place your order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
