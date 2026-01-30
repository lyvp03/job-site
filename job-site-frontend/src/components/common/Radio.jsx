import React from 'react';

const Radio = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  name,
  value,
  id,
}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange && !disabled && onChange(e.target.value)}
        disabled={disabled}
        className={`
          mr-2 h-3.5 w-3.5
          text-blue-600
          focus:ring-blue-500
          focus:ring-1
          focus:ring-offset-0
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      />
      
      {label && (
        <label 
          htmlFor={radioId} 
          className={`text-sm font-normal text-gray-700 ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Radio;