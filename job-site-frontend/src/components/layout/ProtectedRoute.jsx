import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // check login
    if (!token) {
        return <Navigate to="/auth/login" state={{ message: 'Vui lòng đăng nhập để tiếp tục' }} replace />;
    }

    //check role if have require
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" state={{ message: 'Bạn không có quyền truy cập trang này' }} replace />;
    }

    return children;
};

export default ProtectedRoute;