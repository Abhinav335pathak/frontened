import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../hooks/useAuth';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { User, UtensilsCrossed, Shield, Image, MapPin, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

// ---------------- Validation Schemas ----------------
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
});

const restaurantSchema = yup.object({
  name: yup.string().required('Restaurant name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone is required'),
  description: yup.string().required('Description is required'),
});

const adminSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// ---------------- Register Component ----------------
const Register = ({ role = 'user' }) => {
  const { register: authRegister } = useAuth(role);
  const navigate = useNavigate();
  const [files, setFiles] = useState({ images: [], logo: null });

  const schema =
    role === 'restaurant'
      ? restaurantSchema
      : role === 'admin'
      ? adminSchema
      : userSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ---------------- File handling ----------------
  const onDrop = (acceptedFiles, type) => {
    if (type === 'logo') setFiles(prev => ({ ...prev, logo: acceptedFiles[0] || null }));
    else setFiles(prev => ({ ...prev, images: acceptedFiles }));
    toast.success(`${type === 'logo' ? 'Logo' : 'Images'} uploaded successfully!`);
  };

  const { getRootProps: getLogoProps, getInputProps: getLogoInputProps } = useDropzone({
    onDrop: files => onDrop(files, 'logo'),
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const { getRootProps: getImagesProps, getInputProps: getImagesInputProps } = useDropzone({
    onDrop: files => onDrop(files, 'images'),
    accept: { 'image/*': [] },
    maxFiles: 5,
  });

  // ---------------- Submit handler ----------------
  const onSubmit = async (data) => {
    try {
      const submitData = { ...data };
      if (role === 'user') submitData.addresses = [data.address];
      if (role === 'restaurant') {
        submitData.images = files.images;
        submitData.logo = files.logo;
      }

      await authRegister(submitData);
      reset();
      setFiles({ images: [], logo: null });
      toast.success('Registration successful!');
      navigate(`/${role}/login`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Registration failed');
    }
  };

  // ---------------- Role-based icons ----------------
  const getIcon = () => {
    switch (role) {
      case 'user': return <User className="h-5 w-5 mx-auto text-orange-500" />;
      case 'restaurant': return <UtensilsCrossed className="h-5 w-5 mx-auto text-orange-500" />;
      case 'admin': return <Shield className="h-5 w-5 mx-auto text-orange-500" />;
      default: return null;
    }
  };

  const isRestaurant = role === 'restaurant';
  const isUser = role === 'user';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          {getIcon()}
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {role.charAt(0).toUpperCase() + role.slice(1)} Registration
          </h2>
          <p className="text-gray-600 mt-2">Create your {role} account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label={`${isRestaurant ? 'Restaurant' : role === 'admin' ? 'Admin' : 'Full'} Name`}
            placeholder="Enter your full name"
            error={errors.name?.message}
            {...register('name')}
            icon={User}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
            icon={User}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password (min 6 chars)"
            error={errors.password?.message}
            {...register('password')}
            icon={Shield}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            error={errors.phone?.message}
            {...register('phone')}
            icon={Phone}
          />

          {isUser && (
            <Input
              label="Address"
              placeholder="Enter your address"
              error={errors.address?.message}
              {...register('address')}
              icon={MapPin}
            />
          )}

          {isRestaurant && (
            <>
              <Input
                label="Restaurant Address"
                placeholder="Enter full address"
                error={errors.address?.message}
                {...register('address')}
                icon={MapPin}
              />
              <Input
                as="textarea"
                label="Restaurant Description"
                placeholder="Describe your restaurant and menu"
                error={errors.description?.message}
                {...register('description')}
                rows={3}
                icon={UtensilsCrossed}
              />

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Restaurant Logo (Optional)</label>
                <div {...getLogoProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 cursor-pointer">
                  <input {...getLogoInputProps()} />
                  <Image className="mx-auto h-8 w-8 text-gray-400" />
                  {files.logo && <p className="mt-2 text-sm text-green-600">Selected: {files.logo.name}</p>}
                </div>
              </div>

              {/* Images Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Restaurant Images (Optional, up to 5)</label>
                <div {...getImagesProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 cursor-pointer">
                  <input {...getImagesInputProps()} />
                  <Image className="mx-auto h-8 w-8 text-gray-400" />
                  {files.images.length > 0 && <p className="mt-2 text-sm text-green-600">{files.images.length} images selected</p>}
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            fullWidth
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
          >
            Create Account
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to={`/${role}/login`} className="text-orange-500 hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
