import { useState, useEffect } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { User, Mail, Phone, Save, Edit3, Shield, Award, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

// Mock function to simulate API calls
const fetchUserProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main Street, City, State 12345',
        joinDate: '2024-01-15'
      });
    }, 1000);
  });
};

const updateUserProfile = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Updating profile:', data);
      resolve(data);
    }, 1000);
  });
};

const UserProfile = () => {
  const [user, setUser] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '',
    joinDate: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user: authUser } = useAuth('user');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile();
        setUser(data);
      } catch (err) {
        toast.error('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserProfile(user);
      setIsEditing(false);
      toast.success('Profile updated successfully! 🎉');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reload original data
    fetchUserProfile().then(data => {
      setUser(data);
      setIsEditing(false);
    });
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="user" />
        <div className="ml-64 flex-1 p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg w-64 mb-8"></div>
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="h-6 bg-slate-200 rounded-lg mb-6 w-48"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-200 rounded-xl mb-4"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="user" />
      <div className="ml-64 flex-1 p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-800 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Edit3 className="h-5 w-5" /> 
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">{user.name}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      Premium Member
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Fixed: Pass the component, not JSX */}
                  <Input
                    label="Full Name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={User} // Pass the component, not <User />
                    className="bg-slate-50 border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={Mail} // Pass the component, not <Mail />
                    className="bg-slate-50 border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={Phone} // Pass the component, not <Phone />
                    className="bg-slate-50 border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                  
                  <Input
                    label="Delivery Address"
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    icon={MapPin} // Pass the component, not <MapPin />
                    className="bg-slate-50 border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>

                {isEditing && (
                  <div className="mt-8 flex gap-4">
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 bg-slate-100 text-gray-700 hover:bg-slate-200 border border-slate-300 py-4 rounded-2xl font-bold transition-all"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Account Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-bold text-gray-800">{new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-bold text-amber-600">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loyalty Points</span>
                    <span className="font-bold text-emerald-600">1,250</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200">
                <h3 className="font-black text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-white rounded-2xl hover:shadow-md transition-all border border-amber-200 hover:border-amber-300">
                    <div className="font-semibold text-gray-800">Order History</div>
                    <div className="text-sm text-gray-600">View your past orders</div>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-2xl hover:shadow-md transition-all border border-amber-200 hover:border-amber-300">
                    <div className="font-semibold text-gray-800">Payment Methods</div>
                    <div className="text-sm text-gray-600">Manage your cards</div>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-2xl hover:shadow-md transition-all border border-amber-200 hover:border-amber-300">
                    <div className="font-semibold text-gray-800">Preferences</div>
                    <div className="text-sm text-gray-600">Dietary preferences</div>
                  </button>
                </div>
              </div>

              {/* Security Status */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-black text-gray-800">Security Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Email verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Phone verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">2FA available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
