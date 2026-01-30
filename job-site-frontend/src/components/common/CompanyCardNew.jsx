import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyCardNew = ({ company }) => {
  const navigate = useNavigate();

  const statusBadges = {
    hiring: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Hiring' },
    remote: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Remote' },
    featured: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'Featured' }
  };

  // Resolve logo URL - handle both relative and absolute paths
  const getLogoUrl = (logo) => {
    if (!logo) return null;
    
    // If already a full URL, return as is
    if (logo.startsWith('http://') || logo.startsWith('https://')) {
      return logo;
    }
    
    // If relative path, resolve to full URL
    if (logo.startsWith('/')) {
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      return `${baseUrl}${logo}`;
    }
    
    // Otherwise return as is
    return logo;
  };

  const getStatusBadge = () => {
    if (company.isFeatured) return statusBadges.featured;
    if (company.isHiring) return statusBadges.hiring;
    if (company.isRemote) return statusBadges.remote;
    return statusBadges.hiring;
  };

  // Get initials from company name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate color based on company name
  const getColorFromName = (name) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-indigo-400 to-indigo-600',
      'from-cyan-400 to-cyan-600',
      'from-red-400 to-red-600',
    ];
    const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
    return colors[hash % colors.length];
  };

  const getDescription = () => {
    if (company.description) return company.description;
    if (company.overview) return company.overview;
    if (company.website) return `Khám phá thêm về ${company.name} tại ${company.website}`;
    if (company.industry) return `${company.name} là công ty hoạt động trong lĩnh vực ${company.industry}`;
    return `Tìm hiểu thêm về ${company.name} và gia nhập đội ngũ của họ.`;
  };

  const badge = getStatusBadge();
  const initials = getInitials(company.name);
  const colorGradient = getColorFromName(company.name);

  const handleViewProfile = () => {
    navigate(`/companies/${company._id}`, { state: { company } });
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#1E1C30] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer">
      {/* Banner */}
      <div
        className="h-24 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: 
            typeof company.bannerImage === 'string' && company.bannerImage.startsWith('url')
              ? company.bannerImage
              : typeof company.bannerImage === 'string' && company.bannerImage.startsWith('linear-gradient')
              ? `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23584be2;stop-opacity:1%22 /%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23AB81CD;stop-opacity:1%22 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grad)%22/%3E%3C/svg%3E')`
              : 'linear-gradient(135deg, #584be2 0%, #AB81CD 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5" style={{ paddingTop: '2.5rem' }}>
        <div className="flex justify-between items-start -mt-14 mb-3 relative z-10">
          {/* Logo or Initials */}
          <div className="bg-white dark:bg-[#252238] p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-[#1E1C30]">
            {company.logo ? (
              <img
                alt={company.name}
                className="w-16 h-16 rounded-lg object-cover"
                src={getLogoUrl(company.logo)}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-16 h-16 rounded-lg bg-gradient-to-br ${colorGradient} flex items-center justify-center text-white font-bold text-lg ${
                company.logo ? 'hidden' : 'flex'
              }`}
            >
              {initials}
            </div>
          </div>
          <div className="mt-0">
            <span className={`px-2 py-1 rounded-md ${badge.bg} ${badge.text} text-xs font-bold uppercase tracking-wide`}>
              {badge.label}
            </span>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {company.name}
          </h3>
          {company.city && (
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {company.city}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {company.industry && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {company.industry}
            </span>
          )}
          {company.fundingStage && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {company.fundingStage}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-grow leading-relaxed">
          {getDescription()}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15a23.931 23.931 0 01-9-1.745M12 21h9m-9 0H3m9 0a9 9 0 019-9M3 12a9 9 0 019-9" />
            </svg>
            <span className="text-xs font-medium">{(company.totalJobs || company.activeJobs || company.jobs?.length || 0)} vị trí tuyển dụng</span>
          </div>
          <button
            onClick={handleViewProfile}
            className="text-blue-600 dark:text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Xem chi tiết
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCardNew;
