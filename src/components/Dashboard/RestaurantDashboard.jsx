import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../Layout/Sidebar";
import Button from "../UI/Button";
import { UtensilsCrossed, DollarSign, Users, ToggleLeft, ToggleRight } from "lucide-react";
import { menuItemApi } from '../../services/api'; // ✅ import your API

const RestaurantDashboard = () => {
  const { user, loading, toggleStatus } = useAuth("restaurant");
  const [menu, setMenu] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fetch restaurant's menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (!user?._id) return;
        const response = await menuItemApi.getAll(user._id); // backend should handle filtering
        if (response.data.success) {
          setMenu(response.data.menuItems);
        } else {
          toast.error("Failed to load menu items");
        }
      } catch (error) {
        console.error("Menu fetch error:", error);
        toast.error("Error fetching menu items");
      }
    };

    fetchMenu();
  }, [user]);

  useEffect(() => {
    if (user) setIsOpen(user.status || false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 ml-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <p className="ml-64 p-8">Loading profile or not authorized...</p>;
  }

  const handleToggleStatus = async () => {
    try {
      const res = await toggleStatus();
      setIsOpen(res.status);
      toast.success(res.status ? "Restaurant opened" : "Restaurant closed");
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  const handleUpdateMenu = async (itemId, newStatus) => {
    try {
      const updated = await menuItemApi.update(itemId, { status: newStatus });
      if (updated.data.success) {
        setMenu((prev) =>
          prev.map((item) => (item._id === itemId ? { ...item, status: newStatus } : item))
        );
        toast.success("Menu item updated");
      } else {
        toast.error("Failed to update menu item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating menu item");
    }
  };

  return (
    <div className="flex">
      <Sidebar role="restaurant" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Restaurant Dashboard - {user?.name || "Restaurant"}
            </h1>
            <Button
              onClick={handleToggleStatus}
              variant={isOpen ? "danger" : "primary"}
              className="flex items-center"
            >
              {isOpen ? (
                <ToggleLeft className="h-4 w-4 mr-2" />
              ) : (
                <ToggleRight className="h-4 w-4 mr-2" />
              )}
              {isOpen ? "Close Restaurant" : "Open Restaurant"}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <UtensilsCrossed className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="text-lg font-semibold">Menu Items</h3>
              <p className="text-2xl font-bold text-gray-800">{menu.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <DollarSign className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="text-lg font-semibold">Today's Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">$1,250</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="text-lg font-semibold">Orders Today</h3>
              <p className="text-2xl font-bold text-gray-800">45</p>
            </div>
          </div>

          {/* Menu Management */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Menu Items</h2>
            </div>

            {menu.length > 0 ? (
              <div className="divide-y">
                {menu.map((item) => (
                  <div key={item._id} className="p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                    <select
                      value={item.status || "available"}
                      onChange={(e) => handleUpdateMenu(item._id, e.target.value)}
                      className="border rounded-lg px-3 py-1"
                    >
                      <option value="available">Available</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No menu items. Add some!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
