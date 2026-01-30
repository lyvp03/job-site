import React from 'react';
import RadioNew from '../common/RadioNew';
import FilterPanel from '../common/FilterPanel';
import { DollarSign } from 'lucide-react';

const SalaryFilter = ({ selectedValue = '', onChange }) => {
  const salaryList = [
    { id: 'under-3', label: 'Dưới 3 triệu', value: '0-3' },
    { id: '3-5', label: 'Từ 3-5 triệu', value: '3-5' },
    { id: '5-10', label: 'Từ 5-10 triệu', value: '5-10' },
    { id: '10-20', label: 'Từ 10-20 triệu', value: '10-20' },
    { id: 'over-20', label: 'Trên 20 triệu', value: '20+' },
  ];

  return (
    <FilterPanel title="Mức lương" icon={DollarSign}>
      {salaryList.map((sal) => {
        const isChecked = selectedValue === sal.value;
        
        return (
          <RadioNew
            key={sal.id}
            label={sal.label}
            name="salary"
            value={sal.value}
            checked={isChecked}
            onChange={() => onChange?.(sal.value)}
          />
        );
      })}
    </FilterPanel>
  );
};

export default SalaryFilter;