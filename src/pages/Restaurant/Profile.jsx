import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/Layout/Sidebar';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { UtensilsCrossed, Image, Edit3, Save, Loader2, X, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Restaurant name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  description: yup.string().required('Description is required'),
});

const RestaurantProfile = () => {
  const { user, loading, updateProfile, fetchProfile } = useAuth('restaurant');
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [files, setFiles] = useState({ images: [], logo: null });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        description: user.description || '',
      });
      setFiles({ images: user.images || [], logo: user.logo || null });
    }
  }, [user, reset]);

  const onDrop = (acceptedFiles, type) => {
    if (type === 'logo') setFiles(prev => ({ ...prev, logo: acceptedFiles[0] || null }));
    else setFiles(prev => ({ ...prev, images: [...prev.images, ...acceptedFiles] }));
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

  const onSubmit = async (data) => {
    setUpdateLoading(true);
    try {
      await updateProfile({ ...data, images: files.images, logo: files.logo });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      await fetchProfile();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/restaurant/login';
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    reset({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      description: user.description || '',
    });
    setFiles({ images: user?.images || [], logo: user?.logo || null });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 ml-64">
      <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="flex">
      <Sidebar role="restaurant" />
      <div className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Restaurant Profile</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="secondary" className="flex items-center">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-8">
              <UtensilsCrossed className="h-16 w-16 text-orange-500 mr-4" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">Restaurant ID: {user?.id || 'N/A'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Pass the component type, not JSX */}
              <Input label="Name" error={errors.name?.message} {...register('name')} disabled={!isEditing} icon={UtensilsCrossed} />
              <Input label="Email" type="email" error={errors.email?.message} {...register('email')} disabled={!isEditing} icon={Mail} />
              <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} disabled={!isEditing} icon={Phone} />
              <Input label="Address" error={errors.address?.message} {...register('address')} disabled={!isEditing} icon={MapPin} />
              <Input label="Description" as="textarea" rows={4} error={errors.description?.message} {...register('description')} disabled={!isEditing} icon={UtensilsCrossed} />

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Logo (Optional)</label>
                    <div {...getLogoProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition">
                      <input {...getLogoInputProps()} />
                      <Image className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Drag & drop or click</p>
                      {files.logo && <p className="mt-2 text-sm text-green-600">{files.logo.name || files.logo}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Images (Optional)</label>
                    <div {...getImagesProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition">
                      <input {...getImagesInputProps()} />
                      <Image className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Drag & drop or click</p>
                      {files.images.length > 0 && (
                        <p className="mt-2 text-sm text-green-600">{files.images.length} images selected</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button type="submit" variant="primary" className="flex-1" loading={updateLoading}>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                    <Button type="button" variant="ghost" onClick={cancelEdit} className="flex-1">
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
