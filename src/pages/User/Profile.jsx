import { useState, useEffect } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { User, Mail, Phone, Save, Edit3 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock function to simulate API calls
const fetchUserProfile = async () => {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  };
};

const updateUserProfile = async (data) => {
  console.log('Updating profile:', data);
  return data;
};

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await fetchUserProfile();
      setUser(data);
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="flex">
      <Sidebar role="user" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="secondary">
                <Edit3 className="h-4 w-4 mr-2" /> Edit
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<User className="h-4 w-4" />}
            />
            <Input
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<Phone className="h-4 w-4" />}
            />
          </div>

          {isEditing && (
            <div className="mt-6 flex space-x-4">
              <Button onClick={handleSave} variant="primary" className="flex-1">
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
