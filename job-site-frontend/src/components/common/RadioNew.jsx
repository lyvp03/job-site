import React from 'react';

const RadioNew = ({
  label,
  description = null,
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
    <label
      className={`
        group relative flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer
        transition-all ${
          checked
            ? 'border-blue-600 bg-blue-600/5 shadow-lg shadow-blue-600/20'
            : 'border-slate-700 hover:border-slate-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Custom Radio */}
      <div className="flex items-center justify-center">
        <input
          type="radio"
          id={radioId}
          checked={checked}
          onChange={(e) => onChange && !disabled && onChange(e.target.checked)}
          disabled={disabled}
          name={name}
          value={value}
          className="appearance-none h-5 w-5 rounded-full border-2 border-slate-700 bg-transparent checked:border-blue-600 checked:border-[6px] group-hover:border-slate-500 transition-all focus:ring-0 focus:ring-offset-0"
        />
      </div>

      {/* Content */}
      <div className="flex grow flex-col">
        <p className="text-white text-sm font-bold leading-normal">{label}</p>
        {description && (
          <p className="text-blue-600/70 text-xs mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
};

export default RadioNew;
