import React from 'react';

const Container = ({ 
  children, 
  className = '',
  size = 'lg',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    full: 'max-w-full',
  };

  const combinedClasses = `
    mx-auto px-4 sm:px-6 lg:px-8
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;