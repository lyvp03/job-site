import React, { useState } from 'react';
import { MapPin, ChevronUp, Search, Check } from 'lucide-react';

const SelectNew = ({
  label,
  value = null,
  onChange,
  options = [],
  disabled = false,
  searchable = true,
  placeholder = 'Select an option...',
  className = '',
  error = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter((opt) =>
    opt.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between bg-slate-950 border text-white
          rounded-lg px-4 py-3 text-left transition-all
          ${
            isOpen || error
              ? 'border-blue-600 shadow-lg shadow-blue-600/20'
              : 'border-slate-700 hover:border-slate-600'
          }
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-slate-400" />
          <span className="font-medium">
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronUp
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[300px]">
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-slate-700">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-[18px] h-[18px]" />
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto custom-scrollbar p-2 flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`
                    w-full flex items-center justify-between p-2 rounded-lg text-sm
                    transition-colors mb-1
                    ${
                      value === option.value
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'hover:bg-white/5 text-white'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="w-[18px] h-[18px]" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No options found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-700 flex justify-between items-center bg-slate-950/50">
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchQuery('');
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onChange?.(null);
                setIsOpen(false);
                setSearchQuery('');
              }}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-lg shadow-blue-600/20 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};

export default SelectNew;
