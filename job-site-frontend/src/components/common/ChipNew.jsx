import React, { useState } from 'react';

const ChipNew = ({
  label,
  selected = false,
  onRemove = null,
  onAdd = null,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      onClick={() => {
        if (selected && onRemove) {
          onRemove();
        } else if (!selected && onAdd) {
          onAdd();
        }
      }}
      disabled={disabled}
      className={`
        group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200
        ${
          selected
            ? 'bg-blue-600 text-white border border-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700'
            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span>{label}</span>
      <span className={`
        material-symbols-outlined text-[16px] transition-opacity
        ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        {selected ? 'close' : 'add'}
      </span>
    </button>
  );
};

export default ChipNew;
