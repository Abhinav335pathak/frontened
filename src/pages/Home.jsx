import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/UI/Button';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { menuItemApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);

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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    const filtered = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.restaurantId?.name || '').toLowerCase().includes(query)
    );
    setFilteredMenu(filtered);
    setSearchQuery('');
    toast.success(`Showing results for "${query}"`);
  };

  // Group menu items by restaurant
  const groupedByRestaurant = filteredMenu.reduce((acc, item) => {
    const restaurantName = item.restaurantId?.name || 'Unknown Restaurant';
    if (!acc[restaurantName]) acc[restaurantName] = [];
    acc[restaurantName].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-400 to-red-500 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Delicious Food Delivered Fast
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Order from your favorite local restaurants. Fresh, hot, and right to your door.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex mb-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants or dishes..."
                className="w-full pl-10 pr-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="ml-2 px-6">
              Search
            </Button>
          </form>

          {!user && (
            <Link to="/user/register">
              <Button
                size="lg"
                className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition"
              >
                Order Now
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Menu Items by Restaurant */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Explore Dishes by Restaurant
          </h2>

          {loading ? (
            <p className="text-center">Loading menu...</p>
          ) : (
            Object.keys(groupedByRestaurant).map((restaurant) => (
              <div key={restaurant} className="mb-12">
                <h3 className="text-2xl font-semibold text-orange-500 mb-6 border-b-2 border-orange-200 pb-2">
                  {restaurant}
                </h3>
                <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
                  {groupedByRestaurant[restaurant].map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                    >
                      <img
                        src={item.imageUrl || '/default-food.jpg'}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-800 text-lg">{item.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{item.description || 'Delicious dish'}</p>
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                          <span>₹{item.price}</span>
                          <span className="capitalize">{item.category}</span>
                        </div>
                        {storedRole === 'user' && user ? (
                          <Link to={`/menu/${item._id}`}>
                            <Button variant="primary" size="sm" fullWidth>
                              View Details
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            disabled
                            className="opacity-70 cursor-not-allowed"
                          >
                            Login as User to Order
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
    </>
  );
};

export default Home;
