import React from 'react';

const Alert = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
  showIcon = true,
  dismissible = false
}) => {
  // Type configurations
  const typeConfig = {
    success: {
      bg: 'bg-green-100',
      border: 'border-l-4 border-green-500',
      text: 'text-green-900',
      icon: 'text-green-600',
      hover: 'hover:bg-green-200',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    error: {
      bg: 'bg-red-100', 
      border: 'border-l-4 border-red-500',
      text: 'text-red-900',
      icon: 'text-red-600',
      hover: 'hover:bg-red-200',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-l-4 border-yellow-500',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      hover: 'hover:bg-yellow-200',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-900',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-200', 
      iconPath: 'M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  };

  const config = typeConfig[type];

  return (
    <div
      role="alert"
      className={`
        ${config.bg} ${config.border} ${config.text} ${config.hover}
        p-3 rounded-lg flex items-center transition-all duration-300 ease-in-out
        transform hover:scale-[1.02] ${className}
      `}
    >
      {/* Icon */}
      {showIcon && (
        <svg
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className={`h-5 w-5 flex-shrink-0 mr-3 ${config.icon}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={config.iconPath}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
      )}

      {/* Content */}
      <div className="flex-1">
        {title && (
          <p className="text-sm font-semibold mb-1">{title}</p>
        )}
        <div className="text-sm">{children}</div>
      </div>

      {/* Close Button */}
      {dismissible && (
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;