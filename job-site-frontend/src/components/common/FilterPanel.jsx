import React from 'react';

/**
 * Reusable filter panel wrapper component
 * Reduces repetition in filter components (RegionFilter, ExperienceFilter, SalaryFilter, etc)
 */
const FilterPanel = ({
  title,
  icon: Icon = null,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-6 p-6 rounded-2xl bg-slate-900 border border-slate-700/50 shadow-lg hover:border-blue-600/30 transition-colors duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <h4 className="text-white text-lg font-bold">{title}</h4>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};

export default FilterPanel;
