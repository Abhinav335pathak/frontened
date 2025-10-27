import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { healthCheck } from "../../services/api";
import { toast } from "react-hot-toast";
import { Menu, X, User, UtensilsCrossed, Shield, LogOut, Search, Sparkles } from "lucide-react";

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

  if (loading) return <header className="bg-gradient-to-r from-emerald-600 to-teal-600 h-16 shadow-xl animate-pulse" />;

  const dashboardLabel = role === "user" ? "Orders" : role === "restaurant" ? "Dashboard" : "Admin";

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 shadow-xl sticky top-0 z-50 backdrop-blur-lg bg-white/5">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-black flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">🍕</span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-amber-100">FoodDash</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-white/90 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={`/${role}/profile`} 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> 
                  Profile
                </Link>
                <Link 
                  to={`/${role}/dashboard`} 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  {role === "restaurant" ? <UtensilsCrossed className="h-4 w-4" /> : role === "admin" ? <Shield className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />} 
                  {dashboardLabel}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> 
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to={`/${role}/login`} 
                  className="text-white/90 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  Login
                </Link>
                <Link 
                  to={`/${role}/register`} 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-all"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-lg rounded-2xl p-6 space-y-3 shadow-2xl border border-white/20 animate-fadeIn">
            <Link 
              to="/" 
              className="block py-3 px-4 text-gray-800 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-semibold" 
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link 
                  to={`/${role}/profile`} 
                  className=" py-3 px-4 text-gray-800 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-semibold flex items-center gap-2" 
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link 
                  to={`/${role}/dashboard`} 
                  className=" py-3 px-4 text-gray-800 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-semibold flex items-center gap-2" 
                  onClick={() => setIsOpen(false)}
                >
                  {role === "restaurant" ? <UtensilsCrossed className="h-4 w-4" /> : role === "admin" ? <Shield className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  {dashboardLabel}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left py-3 px-4 text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50 transition-all font-semibold flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to={`/${role}/login`} 
                  className="block py-3 px-4 text-gray-800 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-semibold" 
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to={`/${role}/register`} 
                  className="block py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all hover:scale-105" 
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
