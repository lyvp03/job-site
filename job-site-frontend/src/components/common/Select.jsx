import React from 'react';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  className = '',
  containerClassName = '',
  placeholder = "Select an option",
  required = false,
  disabled = false,
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-gray-500 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className={`relative group ${className}`}>
        
       
        <svg
          className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}  
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Select Element */}
        <select
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className={`
            appearance-none w-full p-3 pr-10 bg-white border border-gray-300 
            rounded-lg text-gray-900 text-sm font-medium
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            outline-none transition-all duration-200
            hover:border-gray-400 cursor-pointer
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
              : ''
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
          `}
        >
          {/* Placeholder Option */}
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>

          {/* Options */}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="text-gray-900 py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
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

export default Select;