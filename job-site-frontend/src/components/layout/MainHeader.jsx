import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

const MainHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Xóa token và user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth/login');
  };

  // Handle logo click - redirect based on role
  const handleLogoClick = () => {
    if (user?.role === 'employer') {
      navigate('/employer/dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#1C2238] py-2 px-10 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <button onClick={handleLogoClick} className="flex items-center hover:opacity-90 transition-opacity">
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
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex items-center gap-6">
        {/* Việc làm - only show for candidates and guests */}
        {(!user || user.role === 'candidate') && (
          <Link 
            to="/jobs" 
            className="text-white hover:text-blue-400 transition-colors font-medium"
          >
            Việc làm
          </Link>
        )}

        {/* Công ty - only show for candidates and guests */}
        {(!user || user.role === 'candidate') && (
          <Link 
            to="/companies" 
            className="text-white hover:text-blue-400 transition-colors font-medium"
          >
            Công ty
          </Link>
        )}

        {user ? (
          // Logged in
          <div className="flex items-center gap-4">
            {/* Dashboard Link */}
            {user.role === 'employer' ? (
              <Link 
                to="/employer/dashboard" 
                className="text-white hover:text-blue-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
            ) : user.role === 'admin' ? (
              <Link 
                to="/admin/dashboard" 
                className="text-white hover:text-blue-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/candidate/dashboard" 
                className="text-white hover:text-blue-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="font-medium">{user.name}</span>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hồ sơ của tôi
                  </Link>

                  {user.role === 'employer' && (
                    <>
                      <Link
                        to="/my-companies"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Công ty của tôi
                      </Link>
                      <Link
                        to="/my-jobs"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Tin tuyển dụng
                      </Link>
                    </>
                  )}

                  {user.role === 'candidate' && (
                    <Link
                      to="/my-applications"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đơn ứng tuyển
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 mt-2"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Not logged in
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
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

export default MainHeader;