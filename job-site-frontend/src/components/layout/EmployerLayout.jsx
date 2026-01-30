import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EmployerHeader from './EmployerHeader';
import EmployerSidebar from './EmployerSideBar';
import Footer from './Footer';

const EmployerLayout = () => {
    const { user, token, loading } = useAuth();
    
    // wait authcontext load
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }
    
   

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <EmployerHeader />
            
            <div className="flex flex-1">
                {/* Sidebar */}
                <EmployerSidebar />
                
                {/* Main content */}
                <main className="flex-1 p-6 ml-64"> {/* ml-64 = sidebar width */}
                    <Outlet />
                </main>
            </div>

  
            
         
        </div>
    );
};

export default EmployerLayout;