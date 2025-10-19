// Button Component for HealthMate Frontend
// Reusable button component with consistent styling

import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base classes
  const baseClasses = 'btn';
  
  // Variant classes
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };
  
  // Additional classes
  const additionalClasses = [
    fullWidth ? 'btn-block' : '',
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    additionalClasses
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`btn-group ${className}`} {...props}>
      {children}
    </div>
  );
};

// Icon Button Component
export const IconButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning',
  };
  
  const sizeClasses = {
    sm: 'btn-sm p-2',
    md: 'p-3',
    lg: 'btn-lg p-4',
    xl: 'btn-xl p-5',
  };
  
  const additionalClasses = [
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    additionalClasses
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
