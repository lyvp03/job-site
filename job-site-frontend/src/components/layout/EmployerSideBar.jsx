import React from 'react';
import { NavLink } from 'react-router-dom';

const EmployerSidebar = () => {
    const navItems = [
        { 
            path: '/employer/dashboard', 
            icon: '', 
            label: 'Tổng quan' 
        },
        { 
            path: '/employer/jobs/manage', 
            icon: '', 
            label: 'Quản lý tin tuyển dụng' 
        },
        { 
            path: '/employer/jobs/create', 
            icon: '', 
            label: 'Đăng tin mới' 
        },
        { 
            path: '/employer/company/profile', 
            icon: '', 
            label: 'Hồ sơ công ty' 
        },
    ];

    return (
        <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                isActive
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default EmployerSidebar;