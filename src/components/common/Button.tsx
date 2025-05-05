import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 disabled:text-gray-400',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
  };
  
  const sizeClasses = 'px-4 py-2 text-sm';
  
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabled ? 'cursor-not-allowed' : ''} ${className}`;
  
  return (
    <button 
      className={allClasses} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;