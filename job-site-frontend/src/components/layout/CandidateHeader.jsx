import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CandidateHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userName = user?.name || 'Ứng viên';

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#1C2238] py-2 px-10 flex justify-between items-center sticky top-0 z-50 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <img 
            src="/image/logo.png" 
            alt="5Jobs - Job Matching 5.0" 
            className="h-20 w-auto"
          />
          <img
            src="/image/slogan.png"
            alt=""
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex items-center gap-6">
        {/* Việc làm */}
        <Link 
          to="/jobs" 
          className="text-white hover:text-blue-400 transition-colors font-medium"
        >
          Việc làm
        </Link>

        {/* Công ty */}
        <Link 
          to="/companies" 
          className="text-white hover:text-blue-400 transition-colors font-medium"
        >
          Công ty
        </Link>

        {user ? (
          // Logged in
          <div className="flex items-center gap-4">
            {/* Dashboard Link */}
            <Link 
              to="/candidate/dashboard" 
              className="text-white hover:text-blue-400 transition-colors font-medium"
            >
              Dashboard
            </Link>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{userName}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Ứng viên
                    </span>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </Link>

                    <Link
                      to="/candidate/applications"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Đơn ứng tuyển
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Not logged in
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/auth/login')}
              className="border-white text-white hover:bg-white hover:text-[#1C2238]"
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => navigate('/auth/register')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Đăng ký
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateHeader;