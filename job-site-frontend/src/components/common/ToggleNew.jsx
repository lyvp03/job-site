import React, { useState } from 'react';

const ToggleNew = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  name,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <label
      className={`
        relative inline-flex items-center cursor-pointer justify-between w-full group
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
        {label}
      </span>

      {/* Custom Toggle */}
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer
            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
            after:start-[2px] after:bg-white after:border-gray-300 after:border
            after:rounded-full after:h-5 after:w-5 after:transition-all
            peer-checked:bg-blue-600 shadow-inner
            transition-all duration-300
          `}
        />
      </div>
    </label>
  );
};

export default ToggleNew;
