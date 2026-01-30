import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-[#1C2238] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4 gap-2">
              <div className="flex items-center">
                <img src='/image/logo.png' alt="5Jobs" className="h-20 w-auto"></img>
              </div>
              <div>
                <img src="/image/slogan.png" className="h-8"></img>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Nền tảng kết nối ứng viên và nhà tuyển dụng
            </p>
          </div>
          
          {/* Candidate Links - Chỉ hiển thị cho candidate */}
          {(!user || user.role === 'candidate') && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Ứng viên</h3>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-gray-400 hover:text-white">Tìm việc làm</Link></li>
                <li><Link to="/companies" className="text-gray-400 hover:text-white">Công ty</Link></li>
                {user && user.role === 'candidate' && (
                  <li><Link to="/candidate/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                )}
              </ul>
            </div>
          )}
          
          {/* Employer Links - Chỉ hiển thị cho employer */}
          {(!user || user.role === 'employer') && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Nhà tuyển dụng</h3>
              <ul className="space-y-2">
                {user && user.role === 'employer' ? (
                  <>
                    <li><Link to="/employer/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                    <li><Link to="/employer/jobs/create" className="text-gray-400 hover:text-white">Đăng tin tuyển dụng</Link></li>
                    <li><Link to="/employer/company/profile" className="text-gray-400 hover:text-white">Hồ sơ công ty</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/jobs" className="text-gray-400 hover:text-white">Tìm ứng viên</Link></li>
                    <li><Link to="/companies" className="text-gray-400 hover:text-white">Các công ty</Link></li>
                  </>
                )}
              </ul>
            </div>
          )}
          
          {/* Admin Links - Chỉ hiển thị cho admin */}
          {user && user.role === 'admin' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Quản trị</h3>
              <ul className="space-y-2">
                <li><Link to="/admin/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="/admin/jobs" className="text-gray-400 hover:text-white">Quản lý tin</Link></li>
                <li><Link to="/admin/companies" className="text-gray-400 hover:text-white">Quản lý công ty</Link></li>
                <li><Link to="/admin/users" className="text-gray-400 hover:text-white">Quản lý người dùng</Link></li>
              </ul>
            </div>
          )}
          
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">5JOBS</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white">Về chúng tôi</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Liên hệ</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} 5Jobs - Job Matching 5.0. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;