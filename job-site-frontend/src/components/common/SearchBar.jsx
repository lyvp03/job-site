import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ 
  placeholder = 'Tìm kiếm...',
  locationPlaceholder = 'Thành phố, tỉnh hoặc Remote',
  onSearch,
  onChange,
  onLocationChange,
  searchValue = '',
  locationValue = '',
  showLocation = true,
  showButton = true,
  variant = 'modern' // 'modern' or 'simple'
}) => {
  const [query, setQuery] = useState(searchValue);
  const [location, setLocation] = useState(locationValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ query, location });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onChange?.(value);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    onLocationChange?.(value);
  };

  // Modern variant (like CompaniesPage)
  if (variant === 'modern') {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-3 rounded-2xl shadow-2xl shadow-blue-500/20 border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row gap-3 hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-300">
          <div className="flex-1 flex items-center px-4 h-12 md:h-14 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-600 rounded-lg md:rounded-none">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-slate-400 text-base"
              placeholder={placeholder}
            />
          </div>
          {showLocation && (
            <div className="flex-1 flex items-center px-4 h-12 md:h-14 rounded-lg md:rounded-none">
              <MapPin className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-slate-400 text-base"
                placeholder={locationPlaceholder}
              />
            </div>
          )}
          {showButton && (
            <button 
              type="submit"
              className="h-12 md:h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 active:scale-95"
            >
              Tìm kiếm
            </button>
          )}
        </div>
      </form>
    );
  }

  // Simple variant (legacy)
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex bg-gradient-to-r from-primary-600 to-dark-600 rounded-full overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-grow bg-transparent text-white placeholder-blue-200 px-6 py-4 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-accent-500 text-white px-8 hover:bg-accent-600 transition-colors font-bold"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default SearchBar;