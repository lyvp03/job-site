import React, { useState } from 'react';

const InputNew = ({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  error = null,
  icon = null,
  iconPosition = 'left',
  className = '',
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          icon
        )}

        {/* Input */}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full bg-slate-950 border-2 rounded-lg py-2.5 px-4 text-sm text-white
            placeholder-slate-500 focus:outline-none transition-all duration-200
            ${isFocused || error ? 'border-blue-600 shadow-lg shadow-blue-600/20' : 'border-slate-700 hover:border-slate-600'}
            ${error ? 'border-red-500 shadow-lg shadow-red-500/10' : ''}
            ${icon && iconPosition === 'left' ? 'pl-9' : ''}
            ${icon && iconPosition === 'right' ? 'pr-9' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          icon
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputNew;
