import { forwardRef } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';  // Import specific icons

const Input = forwardRef(({ 
  label, 
  icon: Icon, 
  error, 
  as: Component = 'input', 
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors';
  const classes = `${baseClasses} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        )}
        <Component
          ref={ref}
          className={`${classes} ${Icon ? 'pl-10' : ''} ${Component === 'textarea' ? 'resize-none' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;