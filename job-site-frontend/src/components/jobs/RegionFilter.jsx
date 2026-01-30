import React from 'react';
import RadioNew from '../common/RadioNew';
import FilterPanel from '../common/FilterPanel';
import { MapPin } from 'lucide-react';

const RegionFilter = ({ selectedValue = '', onChange }) => {
  const regions = [
    { id: 'northern', label: 'Miền Bắc', description: '', value: 'Miền Bắc' },
    { id: 'central', label: 'Miền Trung', description: ' ', value: 'Miền Trung' },
    { id: 'southern', label: 'Miền Nam', description: ' ', value: 'Miền Nam' },
  ];

  return (
    <FilterPanel title="Vùng miền" icon={MapPin}>
      {regions.map((region) => {
        const isChecked = selectedValue === region.value;
        
        return (
          <RadioNew
            key={region.id}
            label={region.label}
            description={region.description}
            name="region"
            value={region.value}
            checked={isChecked}
            onChange={() => onChange?.(region.value)}
          />
        );
      })}
    </FilterPanel>
  );
};

export default RegionFilter;