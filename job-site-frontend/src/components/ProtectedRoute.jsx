import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Protected Route cho tất cả users đã đăng nhập
export const PrivateRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

// Protected Route chỉ cho Candidate
export const CandidateRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user.role !== 'candidate') {
        // Redirect về dashboard của role hiện tại
        if (user.role === 'employer') {
            return <Navigate to="/employer/dashboard" replace />;
        }
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

// Protected Route chỉ cho Employer
export const EmployerRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user.role !== 'employer') {
        // Redirect về dashboard của role hiện tại
        if (user.role === 'candidate') {
            return <Navigate to="/candidate/dashboard" replace />;
        }
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

// Protected Route chỉ cho Admin
export const AdminRoute = ({ children }) => {
    const { user, token, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    // Check admin - có thể dùng role hoặc email đặc biệt
    const isAdmin = user.role === 'admin' || user.email === 'admin@5jobs.com';

    if (!isAdmin) {
        // Redirect về dashboard của role hiện tại
        if (user.role === 'candidate') {
            return <Navigate to="/candidate/dashboard" replace />;
        }
        if (user.role === 'employer') {
            return <Navigate to="/employer/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};