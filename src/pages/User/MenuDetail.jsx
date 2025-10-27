import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { menuItemApi } from '../../services/api';
import Button from '../../components/UI/Button';
import { toast } from 'react-hot-toast';

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { menuItemApi } from '../../services/api';
import Button from '../../components/UI/Button';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Star, Clock, Heart, Shield, Truck, Users, Zap } from 'lucide-react';

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await menuItemApi.getById(id);
        setItem(res.data.menuItem);
      } catch (error) {
        toast.error('Failed to load menu item');
      }
    };
    fetchMenuItem();
  }, [id]);

  if (!item) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded-lg w-48 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800">Dish Details</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="relative group">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
              <img
                src={item.imageUrl || '/default-food.jpg'}
                alt={item.name}
                className={`w-full h-96 object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-6 left-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-full font-black text-lg shadow-2xl">
              ₹{item.price}
            </div>
            
            <button
              onClick={() => setFavorite(!favorite)}
              className="absolute top-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all group"
            >
              <Heart 
                className={`w-7 h-7 transition-all ${
                  favorite 
                    ? 'fill-rose-500 text-rose-500 scale-110' 
                    : 'text-gray-400 group-hover:text-rose-400'
                }`}
              />
            </button>

            {/* Category Badge */}
            {item.category && (
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
              {/* Title & Rating */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4 leading-tight">
                  {item.name}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-gray-800">4.5</span>
                    <span className="text-gray-600 text-sm">(120 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-700">25-30 min</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  {item.description || 'Experience culinary excellence with this carefully crafted dish, made from the finest ingredients and prepared with passion by our expert chefs.'}
                </p>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-gray-500 text-sm">
                    🎯 <span className="font-semibold">Fresh Ingredients</span> • 
                    👨‍🍳 <span className="font-semibold">Expertly Prepared</span> • 
                    🌱 <span className="font-semibold">Quality Guaranteed</span>
                  </p>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-6 mb-8 border border-slate-200">
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  From {item.restaurantId?.name || 'Premium Restaurant'}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>4.8★</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>30 min delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Premium Partner</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Zap, text: 'Fast Delivery', color: 'text-amber-500' },
                  { icon: Shield, text: 'Quality Assured', color: 'text-emerald-500' },
                  { icon: Truck, text: 'Free Delivery', color: 'text-blue-500' },
                  { icon: Users, text: 'Best Seller', color: 'text-purple-500' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-200">
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate(`/order/${item._id}`)}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg"
                >
                  Order Now - ₹{item.price}
                </Button>
                <button className="px-6 py-4 border-2 border-slate-300 text-gray-700 rounded-2xl font-semibold hover:border-amber-400 hover:text-amber-600 transition-all">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail;
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await menuItemApi.getById(id);
        setItem(res.data.menuItem);
      } catch (error) {
        toast.error('Failed to load menu item');
      }
    };
    fetchMenuItem();
  }, [id]);

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:flex gap-10">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full md:w-1/2 h-96 object-cover rounded-xl shadow-lg"
        />
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.name}</h1>
          <p className="text-gray-600 mb-6">{item.description}</p>
          <p className="text-2xl font-semibold text-orange-500 mb-4">${item.price}</p>
          <p className="text-gray-500 mb-8">Category: {item.category}</p>

          <Button variant="primary" size="lg" onClick={() => navigate(`/order/${item._id}`)}>
            Order Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuDetail;
