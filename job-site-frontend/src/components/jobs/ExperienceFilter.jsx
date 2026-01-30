import React from 'react';
import RadioNew from '../common/RadioNew';
import FilterPanel from '../common/FilterPanel';
import { Award } from 'lucide-react';

const ExperienceFilter = ({ selectedValue = '', onChange }) => {
  const experiences = [
    { id: 'junior', label: '0-2 năm', description: ' ', value: '0-2' },
    { id: 'mid', label: '3-5 năm', description: ' ', value: '3-5' },
    { id: 'senior', label: '5+ năm', description: ' ', value: '5+' },
  ];

  return (
    <FilterPanel title="Kinh nghiệm" icon={Award}>
      {experiences.map((exp) => {
        const isChecked = selectedValue === exp.value;
        
        return (
          <RadioNew
            key={exp.id}
            label={exp.label}
            description={exp.description}
            name="experience"
            value={exp.value}
            checked={isChecked}
            onChange={() => onChange?.(exp.value)}
          />
        );
      })}
    </FilterPanel>
  );
};

export default ExperienceFilter;