import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

// Đường dẫn logo mặc định của website (thay đổi theo logo của bạn)
const DEFAULT_LOGO = '/logo.png'; // hoặc '/images/default-company-logo.png'

const CompanyCard = ({ company }) => {
    if (!company) return null;

    // Hàm render logo với fallback
    const renderLogo = () => {
        if (company.logo) {
            return (
                <img 
                    src={company.logo} 
                    alt={company.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Nếu logo lỗi, hiển thị chữ cái đầu
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            );
        }
        
        // Tùy chọn: Có thể dùng logo mặc định thay vì chữ cái
        // Uncommment dòng dưới nếu muốn dùng logo mặc định
        // return <img src={DEFAULT_LOGO} alt="Default logo" className="w-full h-full object-contain p-2" />;
        
        // Hiện tại: Hiển thị chữ cái đầu
        return (
            <span className="text-gray-400 font-semibold text-xl">
                {company.name?.charAt(0).toUpperCase() || '?'}
            </span>
        );
    };

    return (
        <Link to={`/companies/${company._id}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-400 hover:shadow-md transition cursor-pointer">
                {/* Logo + Name */}
                <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {renderLogo()}
                        {/* Fallback khi ảnh lỗi */}
                        <span className="text-gray-400 font-semibold text-xl hidden">
                            {company.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {company.name || 'Chưa có tên'}
                        </h3>
                        {company.isVerified && (
                            <span className="inline-flex items-center text-xs text-blue-600 font-medium">
                                <svg className="w-3.5 h-3.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                Đã xác minh
                            </span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5 mb-3 text-sm text-gray-600">
                    {company.industry && (
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                            </svg>
                            <span>{company.industry}</span>
                        </div>
                    )}
                    
                    {company.city && (
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            <span>{company.city}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs">
                        {company.size && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                </svg>
                                {company.size} người
                            </span>
                        )}
                        {company.foundedYear && (
                            <>
                                <span>•</span>
                                <span>Từ {company.foundedYear}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t text-xs">
                    <span className="text-gray-700 font-medium">
                        {company.totalJobs || 0} việc đang tuyển
                    </span>
                    <span className="text-blue-600 font-medium">
                        Xem chi tiết →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CompanyCard;