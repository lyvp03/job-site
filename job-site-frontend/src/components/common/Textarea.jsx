import React from 'react';

const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  textareaClassName = '',
  rows = 4,
  showCount = false,
  maxLength,
  ...props
}) => {
  const [charCount, setCharCount] = React.useState(props.value?.length || 0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const baseTextareaClasses = `
    w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-all duration-200 placeholder-gray-400 text-gray-900 
    hover:border-gray-400 shadow-sm resize-vertical
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
    ${error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
      : ''
    }
    ${textareaClassName}
  `;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {/* Label and Character Count */}
      <div className="flex justify-between items-center mb-2">
        {label && (
          <label className="block text-gray-500 text-sm font-medium">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {showCount && maxLength && (
          <span className={`text-xs ${
            charCount > maxLength ? 'text-red-600' : 'text-gray-500'
          }`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      {/* Textarea Field */}
      <textarea
        className={`${baseTextareaClasses} ${className}`}
        rows={rows}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />

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

export default Textarea;