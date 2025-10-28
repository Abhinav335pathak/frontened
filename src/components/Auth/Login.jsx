import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { User, Shield, UtensilsCrossed } from 'lucide-react';

const Login = ({ role = 'user' }) => {
  const { login: authLogin } = useAuth(role);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  console.log('Form submitted:', form); // Log the form values

  try {
    const userData = await authLogin(form); 
    console.log('Logged in user data:', userData); // Log the returned user data

    toast.success(`Welcome ${userData.name || role}!`);

    console.log('Navigating to dashboard for role:', role); // Log before navigation
    if (role === 'user') navigate('/user/dashboard');
    if (role === 'restaurant') navigate('/restaurant/dashboard');
    if (role === 'admin') navigate('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err); // Log any error
    toast.error(err.message || 'Invalid credentials or server error');
  } finally {
    setLoading(false);
  }
};


  const getIcon = () => {
    switch (role) {
      case 'user':
        return <User className="h-8 w-8 text-orange-500 mx-auto" />;
      case 'restaurant':
        return <UtensilsCrossed className="h-8 w-8 text-orange-500 mx-auto" />;
      case 'admin':
        return <Shield className="h-8 w-8 text-orange-500 mx-auto" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          {getIcon()}
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {role.charAt(0).toUpperCase() + role.slice(1)} Login
          </h2>
          <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            icon={User}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            icon={Shield}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            {role !== 'admin' && (
              <Link to={`/${role}/register`} className="text-orange-500 hover:underline font-semibold">
                Register here
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
