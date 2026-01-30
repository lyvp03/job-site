import React from 'react';
import CheckboxNew from '../common/CheckboxNew';
import { Briefcase } from 'lucide-react';

const JobTypeFilter = ({ selectedTypes = [], onChange }) => {
  const jobTypes = [
    { id: 'full-time', label: 'Toàn thời gian', value: 'full-time'},
    { id: 'part-time', label: 'Bán thời gian', value: 'part-time'},
    { id: 'remote', label: 'Làm từ xa', value: 'remote'}
  ];

  const safeSelectedTypes = Array.isArray(selectedTypes) ? selectedTypes : [];

  const handleCheckboxChange = (value, isChecked) => {
    let newSelectedTypes;
    if (isChecked) {
      newSelectedTypes = [...safeSelectedTypes, value];
    } else {
      newSelectedTypes = safeSelectedTypes.filter(type => type !== value);
    }
    
    if (onChange) {
      onChange(newSelectedTypes);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900 border border-slate-700/50 shadow-lg hover:border-blue-600/30 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Briefcase className="w-5 h-5 text-blue-600" />
        <h4 className="text-white text-lg font-bold">Hình thức làm việc</h4>
      </div>

      {/* Checkbox list */}
      <div className="space-y-1">
        {jobTypes.map((jobType) => {
          const isChecked = safeSelectedTypes.includes(jobType.value);
          return (
            <CheckboxNew
              key={jobType.id}
              label={jobType.label}
              checked={isChecked}
              count={jobType.count}
              onChange={(checked) => handleCheckboxChange(jobType.value, checked)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default JobTypeFilter;