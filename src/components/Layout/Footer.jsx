import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-4 flex items-center">🍕 FoodDash</h3>
            <p className="text-gray-400 mb-4">
              Delicious food delivered fast to your doorstep. Order from top restaurants in your area with ease.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-orange-500 transition p-2 rounded-full bg-gray-800">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-orange-500 transition p-2 rounded-full bg-gray-800">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-orange-500 transition p-2 rounded-full bg-gray-800">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-orange-500 transition p-2 rounded-full bg-gray-800">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-orange-500 transition">Home</Link></li>
              <li><Link to="/user/login" className="hover:text-orange-500 transition">User Login</Link></li>
              <li><Link to="/restaurant/login" className="hover:text-orange-500 transition">Restaurant Login</Link></li>
              <li><Link to="/admin/login" className="hover:text-orange-500 transition">Admin Login</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#" className="hover:text-orange-500 transition">About Us</Link></li>
              <li><Link to="#" className="hover:text-orange-500 transition">Careers</Link></li>
              <li><Link to="#" className="hover:text-orange-500 transition">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-orange-500 transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center"><Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567</p>
              <p className="flex items-center"><Mail className="h-4 w-4 mr-2" /> support@fooddash.com</p>
              <p className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Food St, City, State 12345</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; 2024 FoodDash. All rights reserved. Built with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
