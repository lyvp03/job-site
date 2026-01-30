import React from 'react';
import { Check } from 'lucide-react';

const CheckboxNew = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  count = null,
  className = '',
  name,
  value,
  id,
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label
      className={`
        group flex items-center gap-4 py-3 px-3 rounded-lg hover:bg-white/5 
        cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Custom Checkbox */}
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange && !disabled && onChange(e.target.checked)}
          disabled={disabled}
          name={name}
          value={value}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-700 bg-transparent transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-600/50 focus:ring-0 focus:ring-offset-0"
        />
        <Check className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-4 h-4 left-[2px]" />
      </div>

      {/* Label */}
      <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
        {label}
      </span>

      {/* Count Badge */}
      {count !== null && (
        <span className="ml-auto text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );
};

export default CheckboxNew;
