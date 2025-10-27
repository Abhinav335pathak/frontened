import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, User, ShoppingCart, Settings, UtensilsCrossed, Shield, LogOut, Menu, X, Sparkles, TrendingUp, ChefHat } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Sidebar = ({ role = 'user' }) => {
  const { user, logout } = useAuth(role);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = {
    user: [
      { path: '/user/dashboard', icon: Home, label: 'Dashboard', color: 'from-emerald-400 to-teal-500' },
      { path: '/user/orders', icon: ShoppingCart, label: 'Orders', color: 'from-amber-400 to-orange-500' },
      { path: '/user/profile', icon: User, label: 'Profile', color: 'from-sky-400 to-blue-500' },
      { path: '/user/settings', icon: Settings, label: 'Settings', color: 'from-purple-400 to-pink-500' },
    ],
    restaurant: [
      { path: '/restaurant/dashboard', icon: TrendingUp, label: 'Dashboard', color: 'from-emerald-400 to-teal-500' },
      { path: '/restaurant/manage', icon: ChefHat, label: 'Manage Menu', color: 'from-amber-400 to-orange-500' },
      { path: '/restaurant/profile', icon: User, label: 'Profile', color: 'from-sky-400 to-blue-500' },
      { path: '/restaurant/orders', icon: ShoppingCart, label: 'Orders', color: 'from-purple-400 to-pink-500' },
    ],
    admin: [
      { path: '/admin/dashboard', icon: Shield, label: 'Dashboard', color: 'from-emerald-400 to-teal-500' },
      { path: '/admin/approvals', icon: Sparkles, label: 'Pending Restaurants', color: 'from-amber-400 to-orange-500' },
      { path: '/admin/profile', icon: User, label: 'Profile', color: 'from-sky-400 to-blue-500' },
      { path: '/admin/users', icon: User, label: 'Manage Users', color: 'from-purple-400 to-pink-500' },
    ],
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const items = navItems[role] || navItems.user;

  return (
    <aside className={`bg-gradient-to-b from-slate-50 to-white shadow-xl transition-all duration-300 h-screen fixed left-0 top-0 z-40 border-r border-slate-200 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🍕</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800">Dashboard</h2>
              <p className="text-xs text-gray-500 font-semibold capitalize">{role}</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105` 
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50 hover:shadow-md'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-current'} ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <span className={`font-semibold ${isActive ? 'text-white' : 'text-current'}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        {!isCollapsed && user && (
          <div className="mb-4 p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <p className="font-bold text-gray-800 text-sm truncate">{user.name || 'User'}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-emerald-600 font-semibold">Online</span>
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout} 
          className={`w-full flex items-center px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span className="ml-3 font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
