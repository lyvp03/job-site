import React from 'react';

const RadioGroup = ({
  options,
  name,
  value,
  onChange,
  className = '',
  size = 'md'
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-0.25 text-sm', 
    lg: 'p-0.5 text-base'
  };

  const nameSizeClasses = {
    sm: 'py-1 px-2',
    md: 'py-2 px-3',
    lg: 'py-3 px-4'
  };

  const baseClasses = `
    relative flex flex-wrap rounded-lg bg-gray-100
    box-border shadow-sm border border-gray-200
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <div className={baseClasses}>
      {options.map((option) => (
        <div key={option.value} className="radio flex-1 text-center">
          <input
            type="radio"
            name={name}
            value={option.value}
            id={`${name}-${option.value}`}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="hidden"
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className={`
              name flex cursor-pointer items-center justify-center rounded-md border-none
              transition-all duration-150 ease-in-out
              ${nameSizeClasses[size]}
              ${
                value === option.value
                  ? 'bg-white text-gray-900 font-semibold shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;