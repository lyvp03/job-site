import React from 'react';
import { ChevronDown } from 'lucide-react';
import { industries as industriesData } from '../../utils/industries';

const IndustryFilter = ({ selectedIndustry, onIndustryChange }) => {
  const industries = ['All Industries', ...industriesData];

  return (
    <div className="w-full max-w-[960px] overflow-x-auto no-scrollbar">
      <div className="flex gap-3 pb-2 px-1 justify-start md:justify-center min-w-max">
        <button
          onClick={() => onIndustryChange('All Industries')}
          className={`group flex h-9 items-center gap-x-2 rounded-lg pl-4 pr-3 transition-all ${
            selectedIndustry === 'All Industries'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600'
          }`}
        >
          <span className="text-sm font-medium">Tất cả ngành</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {industries.slice(1).map(industry => (
          <button
            key={industry}
            onClick={() => onIndustryChange(industry)}
            className={`group flex h-9 items-center gap-x-2 rounded-lg pl-4 pr-3 transition-all ${
              selectedIndustry === industry
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600'
            }`}
          >
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium group-hover:text-blue-600 transition-colors">
              {industry}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IndustryFilter;
