import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, User, ShoppingCart, Settings, UtensilsCrossed, Shield, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Sidebar = ({ role = 'user' }) => {
  const { user, logout } = useAuth(role);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = {
    user: [
      { path: '/user/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/user/orders', icon: ShoppingCart, label: 'Orders' },
      { path: '/user/profile', icon: User, label: 'Profile' },
      { path: '/user/settings', icon: Settings, label: 'Settings' },
    ],
    restaurant: [
      { path: '/restaurant/dashboard', icon: UtensilsCrossed, label: 'Dashboard' },
      { path: '/restaurant/manage', icon: Settings, label: 'Manage Menu' },
      { path: '/restaurant/profile', icon: User, label: 'Profile' },
      { path: '/restaurant/orders', icon: ShoppingCart, label: 'Orders' },
    ],
    admin: [
      { path: '/admin/dashboard', icon: Shield, label: 'Dashboard' },
      { path: '/admin/approvals', icon: UtensilsCrossed, label: 'Pending Restaurants' },
      { path: '/admin/profile', icon: User, label: 'Profile' },
      { path: '/admin/users', icon: User, label: 'Manage Users' },
    ],
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const items = navItems[role] || navItems.user;

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 h-screen fixed left-0 top-0 z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-600 hover:text-orange-500 transition">
          {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
        </button>
      </div>

      <nav className="mt-6 px-2">
        <ul className="space-y-2">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-orange-500'} ${isCollapsed ? 'justify-center' : ''}`}>
                  <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        {!isCollapsed && user && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-800">{user.name || 'User'}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        )}
        <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors justify-center">
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
