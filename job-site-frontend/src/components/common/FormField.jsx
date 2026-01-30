import React from 'react';

/**
 * Reusable form field component with label, input, and error message
 * Used in forms like ApplyJobModal to reduce repetition
 */
const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  placeholder,
  className = '',
  containerClassName = '',
  icon: Icon = null,
  helperText = null,
  required = false,
  ...props
}) => {
  return (
    <div className={`p-6 rounded-2xl bg-white dark:bg-[#1c1022]/50 border border-gray-200 dark:border-white/5 ${containerClassName}`}>
      <label className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {label} {required && '*'}
          </span>
          {helperText && (
            <span className="text-xs text-gray-400 dark:text-[#b09db9]">{helperText}</span>
          )}
        </div>
        
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon className="w-5 h-5 text-gray-400 dark:text-[#b09db9]" />
            </div>
          )}
          
          <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full h-14 ${Icon ? 'pl-12 pr-4' : 'px-4'} rounded-lg 
              bg-gray-50 dark:bg-[#1c1022]/50 
              border border-gray-300 dark:border-[#4b3b54] 
              text-gray-900 dark:text-white 
              placeholder:text-gray-400 dark:placeholder:text-[#b09db9]/50 
              font-medium 
              focus:outline-none focus:border-[#E2ADF2] focus:ring-4 focus:ring-[#E2ADF2]/20 
              transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
      </label>
      
      {error && (
        <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;
