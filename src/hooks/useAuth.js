import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { userApi, restaurantApi, adminApi } from '../services/api';

export const useAuth = (role = 'user') => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ---------- FETCH PROFILE ----------
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { setUser(null); return; }

      let res;
      if (role === 'user') res = await userApi.profile();
      else if (role === 'restaurant') res = await restaurantApi.profile();
      else res = await adminApi.profile();

      const userData = res?.data?.user || res?.data?.restaurant || res?.data;
      setUser(userData || null);
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        toast.error('Session expired. Please login again.');
        navigate(`/${role}/login`, { replace: true });
      }
    } finally { setLoading(false); }
  }, [role, navigate]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ---------- LOGIN ----------
  const login = async (data) => {
    try {
      let res;
      if (role === 'user') res = await userApi.login(data);
      else if (role === 'restaurant') res = await restaurantApi.login(data);
      else res = await adminApi.login(data);

      const token = res.data?.token;
      if (!token) throw new Error('No token received');
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      await fetchProfile();
      toast.success('Login successful!');
      return res.data.user || res.data.restaurant || res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  // ---------- REGISTER ----------
  const register = async (data) => {
    try {
      if (role === 'user') await userApi.register(data);
      else if (role === 'restaurant') await restaurantApi.register(data);
      else await adminApi.register(data);
      toast.success('Registered successfully! Please login.');
      navigate(`/${role}/login`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  // ---------- LOGOUT ----------
  const logout = async () => {
    try {
      if (role === 'user') await userApi.logout();
      else if (role === 'restaurant') await restaurantApi.logout();
      else await adminApi.logout();

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/', { replace: true });
    } catch {
      toast.error('Logout failed');
    }
  };

  // ---------- UPDATE PROFILE ----------
  const updateProfile = async (data) => {
    try {
      if (role === 'user') await userApi.updateProfile(data);
      else if (role === 'restaurant') await restaurantApi.updateProfile(data);
      else throw new Error('Admins cannot update profile here');
      await fetchProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Update profile error:', err);
      if (err.response?.status === 401) logout();
      else toast.error('Failed to update profile');
      throw err;
    }
  };

  // ---------- TOGGLE RESTAURANT STATUS ----------
  const toggleStatus = async () => {
    if (role !== 'restaurant') return;
    try {
      const res = await restaurantApi.toggleStatus();
      setUser((prev) => ({ ...prev, isActive: res.data.isActive }));
      return res.data;
    } catch (err) {
      console.error('Toggle status error:', err);
      toast.error('Failed to toggle restaurant status');
      throw err;
    }
  };

  return { user, loading, login, register, logout, fetchProfile, updateProfile, toggleStatus };
};
