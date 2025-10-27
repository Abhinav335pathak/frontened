import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, Award, Zap, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🍕</span>
              </div>
              <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-amber-100">FoodDash</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Delivering culinary excellence with speed and passion. Experience premium food delivery from top-rated restaurants straight to your doorstep.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, color: 'hover:bg-blue-500 hover:text-white' },
                { icon: Twitter, color: 'hover:bg-sky-500 hover:text-white' },
                { icon: Instagram, color: 'hover:bg-pink-500 hover:text-white' },
                { icon: Mail, color: 'hover:bg-amber-500 hover:text-white' }
              ].map((SocialIcon, idx) => (
                <Link 
                  key={idx}
                  to="#" 
                  className={`text-gray-400 p-3 rounded-xl bg-slate-800 transition-all duration-300 transform hover:scale-110 ${SocialIcon.color}`}
                >
                  <SocialIcon.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { path: "/", label: "Home" },
                { path: "/user/login", label: "User Login" },
                { path: "/restaurant/login", label: "Restaurant Login" },
                { path: "/admin/login", label: "Admin Login" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-amber-400 transition-all duration-300 flex items-center gap-2 group font-medium"
                  >
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-black mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { path: "#", label: "About Us" },
                { path: "#", label: "Careers" },
                { path: "#", label: "Privacy Policy" },
                { path: "#", label: "Terms of Service" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 group font-medium"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-black mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-400" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-sky-500/20 rounded-lg group-hover:bg-sky-500 transition-all">
                  <Phone className="h-4 w-4 text-sky-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500 transition-all">
                  <Mail className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">support@fooddash.com</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500 transition-all">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium text-sm">123 Food St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, text: 'Lightning Fast Delivery', color: 'text-amber-400' },
              { icon: Award, text: 'Premium Quality', color: 'text-emerald-400' },
              { icon: Users, text: '50k+ Happy Customers', color: 'text-sky-400' },
              { icon: Heart, text: 'Fresh Ingredients', color: 'text-rose-400' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center">
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                <span className="text-gray-300 text-sm font-semibold">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 FoodDash. All rights reserved. Built with <Heart className="inline h-4 w-4 text-rose-500 fill-rose-500" /> for food lovers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
