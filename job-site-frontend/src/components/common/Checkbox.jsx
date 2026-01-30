import React from 'react';

const Checkbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  name,
  value,
  id,
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center ${disabled ? 'opacity-50' : ''} ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange && !disabled && onChange(e.target.checked)}
          disabled={disabled}
          name={name}
          value={value}
          className={`
            h-5 w-5
            appearance-none
            rounded
            border-2
            border-gray-300
            checked:bg-blue-600
            checked:border-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-0
            transition-colors
            duration-200
            cursor-pointer
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />
        
        {/* Checkmark icon */}
        {checked && (
          <svg 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            fill="none"
          >
            <path 
              d="M11.5 4L5.5 10L2.5 7" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      
      {label && (
        <label 
          htmlFor={checkboxId} 
          className={`ml-3 text-sm ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="text-gray-700">{label}</span>
        </label>
      )}
    </div>
  );
};

export default Checkbox;