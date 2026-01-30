import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'right',
  className = '',
  containerClassName = '',
  inputClassName = '',
  ...props
}) => {
  const hasIcon = !!icon;
  
  const baseInputClasses = `
    w-full px-4 bg-white border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-all duration-200 placeholder-gray-400 text-gray-900 
    hover:border-gray-400 shadow-sm
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
    ${error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
      : ''
    }
    ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
    ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
    ${inputClassName}
  `;

  const inputWithPadding = `
    ${baseInputClasses}
    ${props.type === 'textarea' ? 'py-3 min-h-[100px] resize-vertical' : 'py-3'}
  `;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-gray-500 text-sm font-medium mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {typeof icon === 'string' ? (
              <span className="text-gray-400">{icon}</span>
            ) : (
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            )}
          </div>
        )}

        {/* Input Field */}
        {props.type === 'textarea' ? (
          <textarea
            className={inputWithPadding}
            {...props}
          />
        ) : (
          <input
            className={inputWithPadding}
            {...props}
          />
        )}

        {/* Right Icon */}
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {typeof icon === 'string' ? (
              <span className="text-gray-400">{icon}</span>
            ) : (
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;