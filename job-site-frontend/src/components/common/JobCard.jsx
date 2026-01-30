import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Calendar } from 'lucide-react';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  
  const getLocationText = () => {
    if (!job.location) return 'Chưa rõ';
    if (typeof job.location === 'string') return job.location;
    if (typeof job.location === 'object') {
      return job.location.city || job.location.address || 'Chưa rõ';
    }
    return 'Chưa rõ';
  };

  const getSalaryText = () => {
    if (!job.salary) return 'Thoả thuận';
    if (typeof job.salary === 'string') return job.salary;
    if (typeof job.salary === 'object') {
      if (job.salary.min && job.salary.max) {
        return `${(job.salary.min/1000000).toFixed(0)}-${(job.salary.max/1000000).toFixed(0)} triệu`;
      }
      if (job.salary.min) return `Từ ${(job.salary.min/1000000).toFixed(0)} triệu`;
      if (job.salary.max) return `Lên đến ${(job.salary.max/1000000).toFixed(0)} triệu`;
    }
    return 'Thoả thuận';
  };

  const getTimeText = () => {
    if (!job.createdAt) return '';
    const now = new Date();
    const posted = new Date(job.createdAt);
    
    // Tính số mili giây khác biệt
    const diffMs = now - posted;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Vừa đăng';
    if (diffHours < 24) return `${diffHours}h trước`;
    if (diffDays === 1) return 'Đăng hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    
    // Hiển thị ngày tháng năm đầy đủ cho các bài cũ
    const day = posted.getDate();
    const month = posted.getMonth() + 1;
    const year = posted.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getColorGradient = (name) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-indigo-400 to-indigo-600',
    ];
    const hash = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
    return colors[hash % colors.length];
  };

  const statusBadges = {
    hot: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Hot' },
    new: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Mới' },
    featured: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'Nổi bật' }
  };

  const getStatusBadge = () => {
    if (job.isFeatured) return statusBadges.featured;
    if (getTimeText().includes('hôm nay')) return statusBadges.new;
    return statusBadges.hot;
  };

  const badge = getStatusBadge();
  const colorGradient = getColorGradient(job.companyName || 'Job');

  return (
    <div 
      onClick={() => navigate(`/jobs/${job._id}`)}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#1E1C30] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer"
    >
      {/* Header with company info */}
      <div className="flex flex-col items-start justify-between p-5 pb-0 gap-3">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorGradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
            {job.companyName?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
              {job.companyName}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className={`px-2.5 py-1 rounded-md ${badge.bg} ${badge.text} text-xs font-bold uppercase tracking-wide whitespace-nowrap`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4 space-y-3 flex-1">
        <div className="space-y-2 text-sm">
          {/* Location */}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin size={16} className="flex-shrink-0" />
            <span className="line-clamp-1">{getLocationText()}</span>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <DollarSign size={16} className="flex-shrink-0" />
            <span>{getSalaryText()}</span>
          </div>

          {/* Industry */}
          {job.industry && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                {job.industry}
              </span>
            </div>
          )}

          {/* Job Type & Experience */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{job.jobType || 'Full-time'}</span>
            </div>
            {job.experience && (
              <>
                <span>•</span>
                <span>{job.experience}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Calendar size={14} />
          <span>{getTimeText()}</span>
        </div>
        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          Xem ngay →
        </span>
      </div>
    </div>
  );
};

export default JobCard;