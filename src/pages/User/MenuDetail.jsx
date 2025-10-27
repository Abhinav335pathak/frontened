import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { menuItemApi } from '../../services/api';
import Button from '../../components/UI/Button';
import { toast } from 'react-hot-toast';

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await menuItemApi.getById(id);
        setItem(res.data.menuItem);
      } catch (error) {
        toast.error('Failed to load menu item');
      }
    };
    fetchMenuItem();
  }, [id]);

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:flex gap-10">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full md:w-1/2 h-96 object-cover rounded-xl shadow-lg"
        />
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.name}</h1>
          <p className="text-gray-600 mb-6">{item.description}</p>
          <p className="text-2xl font-semibold text-orange-500 mb-4">${item.price}</p>
          <p className="text-gray-500 mb-8">Category: {item.category}</p>

          <Button variant="primary" size="lg" onClick={() => navigate(`/order/${item._id}`)}>
            Order Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuDetail;
