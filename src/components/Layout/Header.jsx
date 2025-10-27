import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { healthCheck } from "../../services/api";
import { toast } from "react-hot-toast";
import { Menu, X, User, UtensilsCrossed, Shield, LogOut, Search } from "lucide-react";

const Header = ({ role: propRole }) => {
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("role");
  const role = propRole || storedRole || "user";
  const { user, logout: authLogout, loading } = useAuth(role);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkBackend = async () => {
      try { await healthCheck(); } 
      catch { toast.error("⚠️ Backend connection issue."); }
    };
    checkBackend();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    toast.success(`Searching for: ${search}`);
    setSearch("");
  };

  const handleLogout = () => {
    authLogout?.();
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate(`/${role}/login`);
  };

  if (loading) return <header className="bg-gradient-to-r from-orange-400 to-red-500 h-16 shadow-lg animate-pulse" />;

  const dashboardLabel = role === "user" ? "Orders" : role === "restaurant" ? "Dashboard" : "Admin";

  return (
    <header className="bg-gradient-to-r from-orange-400 to-red-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center">🍕 FoodDash</Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:underline transition">Home</Link>
          {user ? (
            <>
              <Link to={`/${role}/profile`} className="text-white hover:underline flex items-center">
                <User className="h-4 w-4 mr-1" /> Profile
              </Link>
              <Link to={`/${role}/dashboard`} className="text-white hover:underline flex items-center">
                {role === "restaurant" ? <UtensilsCrossed className="h-4 w-4 mr-1" /> : role === "admin" ? <Shield className="h-4 w-4 mr-1" /> : null} {dashboardLabel}
              </Link>
              <button onClick={handleLogout} className="text-white hover:bg-white/20 px-3 py-1 rounded flex items-center">
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to={`/${role}/login`} className="text-white hover:underline">Login</Link>
              <Link to={`/${role}/register`} className="bg-white text-orange-500 hover:bg-gray-100 px-4 py-2 rounded-lg">Sign Up</Link>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm px-4 py-4 space-y-3 border-t">
          <Link to="/" className="block py-2 text-gray-800 hover:text-orange-500" onClick={() => setIsOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to={`/${role}/profile`} className="block py-2 text-gray-800 hover:text-orange-500" onClick={() => setIsOpen(false)}>Profile</Link>
              <Link to={`/${role}/dashboard`} className="block py-2 text-gray-800 hover:text-orange-500" onClick={() => setIsOpen(false)}>{dashboardLabel}</Link>
              <button onClick={handleLogout} className="w-full text-left py-2 text-gray-800 hover:text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to={`/${role}/login`} className="block py-2 text-gray-800 hover:text-orange-500" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to={`/${role}/register`} className="block py-2 text-gray-800 hover:text-orange-500" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
