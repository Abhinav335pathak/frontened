import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/UI/Button';
import { Search, Star, Clock, MapPin, TrendingUp, Filter, X, ChevronRight, Sparkles, Award, Heart, ShoppingBag, Zap, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { menuItemApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState(new Set());

  // Role detection
  const storedRole = localStorage.getItem('role') || 'user';
  const { user, loading } = useAuth(storedRole);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await menuItemApi.getAll();
        setMenuItems(res.data.menuItems || []);
        setFilteredMenu(res.data.menuItems || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load menu items');
      }
    };
    fetchMenuItems();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...menuItems];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== 'all') {
      const ranges = {
        'budget': [0, 200],
        'mid': [200, 500],
        'premium': [500, Infinity]
      };
      const [min, max] = ranges[priceRange];
      filtered = filtered.filter(item => item.price >= min && item.price < max);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredMenu(filtered);
  }, [selectedCategory, priceRange, sortBy, menuItems]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredMenu(menuItems);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.restaurantId?.name || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query)
    );
    setFilteredMenu(filtered);
    toast.success(`Found ${filtered.length} results`, {
      icon: '🔍',
      style: {
        borderRadius: '10px',
        background: '#1a365d',
        color: '#fff',
      },
    });
  };

  // Toggle favorite
  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
        toast.success('Removed from favorites', { icon: '💔' });
      } else {
        newFavorites.add(itemId);
        toast.success('Added to favorites', { icon: '❤️' });
      }
      return newFavorites;
    });
  };

  // Get unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  // Group menu items by restaurant
  const groupedByRestaurant = filteredMenu.reduce((acc, item) => {
    const restaurantName = item.restaurantId?.name || 'Unknown Restaurant';
    if (!acc[restaurantName]) acc[restaurantName] = [];
    acc[restaurantName].push(item);
    return acc;
  }, {});

  const categoryIcons = {
    'all': Sparkles,
    'appetizer': ShoppingBag,
    'main course': Award,
    'dessert': Heart,
    'beverage': Zap,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Improved Color Scheme */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-28 relative z-10">
          {/* Premium Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {[
              { icon: Star, text: '4.8★ Rating', color: 'from-amber-400 to-orange-400' },
              { icon: Clock, text: '30 Min Fast', color: 'from-emerald-400 to-teal-400' },
              { icon: Users, text: '50k+ Orders', color: 'from-rose-400 to-pink-400' },
              { icon: Award, text: 'Top Quality', color: 'from-sky-400 to-blue-400' }
            ].map((stat, idx) => (
              <div key={idx} className={`flex items-center gap-2 bg-gradient-to-r ${stat.color} text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
                <stat.icon className="w-5 h-5" />
                <span className="font-semibold text-sm md:text-base">{stat.text}</span>
              </div>
            ))}
          </div>

          {/* Main Heading with Sparkle Effect */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">Premium Food Delivery Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-emerald-100">
                Taste The
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 drop-shadow-2xl">
                Difference
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-cyan-100 max-w-3xl mx-auto font-light leading-relaxed">
              Discover culinary excellence from premium restaurants. 
              <span className="block mt-2 font-semibold text-white">Fresh • Fast • Fabulous</span>
            </p>
          </div>

          {/* Premium Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex flex-col sm:flex-row gap-3 bg-white rounded-3xl p-2 shadow-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-cyan-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cuisine, restaurant, or dish..."
                    className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-800 focus:outline-none text-base font-medium bg-transparent"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl transition-all hover:scale-105 whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user && (
              <>
                <Link to="/user/register">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-12 py-5 rounded-full font-bold text-lg shadow-2xl transition-all hover:scale-110 inline-flex items-center gap-3 group">
                    Get Started Free
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <button className="bg-white/20 backdrop-blur-md border-2 border-white/40 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white/30 transition-all inline-flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Explore Menu
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modern Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
            <path d="M0 0L48 8.9C96 18 192 36 288 42.7C384 49 480 43 576 37.3C672 32 768 25 864 26.7C960 29 1056 39 1152 42.7C1248 46 1344 43 1392 41.3L1440 40V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Delivery in 30 mins', color: 'from-amber-400 to-orange-500' },
              { icon: Award, title: 'Top Rated', desc: '5-star restaurants', color: 'from-emerald-400 to-teal-500' },
              { icon: Heart, title: 'Fresh Food', desc: 'Quality guaranteed', color: 'from-rose-400 to-pink-500' },
              { icon: Users, title: 'Happy Customers', desc: '50k+ satisfied', color: 'from-sky-400 to-blue-500' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-slate-100">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-base md:text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section - Premium Design */}
      <section className="bg-white border-y border-slate-200 sticky top-0 z-40 shadow-md backdrop-blur-xl bg-white/95">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category Pills - Enhanced */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
              {categories.map((cat) => {
                const IconComponent = categoryIcons[cat.toLowerCase()] || Sparkles;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* Filter & Sort Controls - Enhanced */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl hover:shadow-md transition-all font-semibold flex-1 lg:flex-initial justify-center ${
                  showFilters 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl border-none focus:ring-2 focus:ring-amber-500 font-semibold flex-1 lg:flex-initial cursor-pointer hover:bg-slate-200 transition"
              >
                <option value="popular">🔥 Popular</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters - Enhanced */}
          {showFilters && (
            <div className="mt-5 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-600" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-white rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    💵 Price Range
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 'all', label: 'All Prices', gradient: 'from-slate-400 to-slate-500' },
                      { value: 'budget', label: '₹0 - ₹200', gradient: 'from-emerald-400 to-teal-500' },
                      { value: 'mid', label: '₹200 - ₹500', gradient: 'from-sky-400 to-blue-500' },
                      { value: 'premium', label: '₹500+', gradient: 'from-amber-400 to-orange-500' }
                    ].map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setPriceRange(range.value)}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                          priceRange === range.value
                            ? `bg-gradient-to-r ${range.gradient} text-white shadow-lg`
                            : 'bg-white text-gray-700 border-2 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu Items Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {/* Section Header - Enhanced */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-2 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <span className="text-amber-700 font-semibold">Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
              Explore Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">Delicious</span> Menu
            </h2>
            <p className="text-gray-600 text-lg">
              {filteredMenu.length} mouthwatering dishes waiting for you ✨
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-56 bg-gradient-to-br from-slate-200 to-slate-300"></div>
                  <div className="p-6">
                    <div className="h-5 bg-slate-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded-lg mb-4 w-3/4"></div>
                    <div className="h-10 bg-slate-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMenu.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6">
                <Search className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">No dishes found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your filters or search for something else</p>
            </div>
          ) : (
            Object.keys(groupedByRestaurant).map((restaurant, idx) => (
              <div key={restaurant} className={idx > 0 ? 'mt-20' : ''}>
                {/* Restaurant Header - Premium Design */}
                <div className="relative mb-8 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
                  <div className="relative flex items-center gap-4 bg-gradient-to-r from-white via-amber-50 to-orange-50 p-6 rounded-3xl shadow-lg border border-amber-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {restaurant.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-1">{restaurant}</h3>
                      <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        {groupedByRestaurant[restaurant].length} amazing dishes available
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-full">
                      <Star className="w-4 h-4 fill-white" />
                      <span className="font-bold">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Menu Grid - Enhanced Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedByRestaurant[restaurant].map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group relative"
                    >
                      {/* Image Container with Gradient Overlay */}
                      <div className="relative overflow-hidden h-56">
                        <img
                          src={item.imageUrl || '/default-food.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-full font-black text-lg shadow-xl">
                          ₹{item.price}
                        </div>
                        
                        {/* Category Badge */}
                        {item.category && (
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 text-xs font-bold uppercase tracking-wide shadow-lg">
                            {item.category}
                          </div>
                        )}

                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(item._id)}
                          className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Heart 
                            className={`w-6 h-6 ${favorites.has(item._id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h4 className="font-black text-gray-800 text-xl mb-2 line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px] leading-relaxed">
                          {item.description || 'Crafted with premium ingredients and passion'}
                        </p>

                        {/* Rating & Info - Enhanced */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span className="font-bold text-gray-800 text-sm">4.5</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-sky-50 to-blue-50 px-3 py-1.5 rounded-full">
                            <Clock className="w-4 h-4 text-sky-600" />
                            <span className="font-semibold text-gray-700 text-sm">25 min</span>
                          </div>
                        </div>

                        {/* Action Button - Premium Gradient */}
                        {storedRole === 'user' && user ? (
                          <Link to={`/menu/${item._id}`}>
                            <Button 
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="w-5 h-5" />
                              Order Now
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            disabled
                            className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold cursor-not-allowed"
                          >
                            Login to Order
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
