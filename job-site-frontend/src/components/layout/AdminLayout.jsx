import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const AdminLayout = () => {
    const { user, token, loading, logout } = useAuth();
    
    // wait AuthContext load
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }
    
    

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { path: '/admin/dashboard', icon: '', label: 'Dashboard' },
        { path: '/admin/jobs', icon: '', label: 'Quản lý tin tuyển dụng' },
        { path: '/admin/companies', icon: '', label: 'Quản lý công ty' },
        { path: '/admin/users', icon: '', label: 'Quản lý người dùng' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#1C2238]">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-purple-500">
                <div className="px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src="/image/logo-white.png" alt="5Jobs" className="h-12" />
                        <div>
                            <span className="text-xl font-bold text-purple-600">
                                Trang quản lý Admin
                            </span>
                            <p className="text-xs text-gray-500">Quản trị hệ thống</p>
                        </div>
                    </div>

                    {/* User menu */}
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            <strong>{user?.name || 'Admin'}</strong>
                        </span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-purple-500 text-white shadow-md'
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

                {/* Main content */}
                <main className="flex-1 p-6 ml-64">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-4 ml-64">
                <div className="px-6 text-center text-sm text-gray-600">
                    © 2025 5Jobs Admin Panel. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;