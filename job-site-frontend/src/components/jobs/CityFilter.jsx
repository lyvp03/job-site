import React, { useState, useEffect } from 'react';
import SelectNew from '../common/SelectNew';
import FilterPanel from '../common/FilterPanel';
import { cities } from '../../utils/cities';
import { MapPin } from 'lucide-react'; 

const CityFilter = ({ selectedValue = '', onChange }) => {
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // Load cities from file
  useEffect(() => {
    try {
      setLoading(true);
      
      // Format data from array cities to option format
      const formattedCities = cities.map(city => ({
        label: city,
        value: city 
      }));
      
      // add option "Tất cả địa điểm"
      const allOptions = [
        { label: 'Tất cả địa điểm', value: '' },
        ...formattedCities
      ];
      
      setCitiesList(allOptions);
      setError(null);
    } catch (err) {
      console.error('Error loading cities:', err);
      setError('Không thể tải danh sách địa điểm');
      
      // Fallback data
      setCitiesList([
        { label: 'Tất cả địa điểm', value: '' },
        { label: 'Hà Nội', value: 'hà-nội' },
        { label: 'Hồ Chí Minh', value: 'hồ-chí-minh' },
        { label: 'Đà Nẵng', value: 'đà-nẵng' },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // handle location change
  const handleLocationChange = (value) => {
    console.log('Location changed to:', value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FilterPanel title="Địa điểm" icon={MapPin}>

      {/* Select component with loading/error state */}
      {loading ? (
        <div className="py-4 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-400 border-t-blue-600"></div>
          <p className="text-sm text-slate-400 mt-2">Đang tải địa điểm...</p>
        </div>
      ) : error ? (
        <div className="py-4">
          <p className="text-sm text-red-400">{error}</p>
          <p className="text-xs text-slate-500 mt-2">Đang dùng dữ liệu mẫu</p>
        </div>
      ) : (
        <SelectNew
          options={citiesList}
          value={selectedValue}
          onChange={handleLocationChange}
          placeholder="Chọn tỉnh/thành phố"
          searchable={true}
        />
      )}
    </FilterPanel>
  );
};

export default CityFilter;