// routes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import HomePage from '../pages/Dashboard/HomePage';
import MainLayout from '../components/layout/MainLayout';
import CommonLayout from '../components/layout/CommonLayout';
import EmployerLayout from '../components/layout/EmployerLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Protected Route Guards
import { CandidateRoute, EmployerRoute, AdminRoute } from '../components/ProtectedRoute';

// Candidate pages
import JobsPage from '../pages/Candidate/JobsPage';
import JobDetailPage from '../pages/Candidate/JobDetailPage';
import CompanyDetailPage from '../pages/Candidate/CompanyDetailPage';
import CompaniesPage from '../pages/Candidate/CompaniesPage';
import CandidateDashboard from '../pages/Candidate/CandidateDashboard';
import CandidateApplicationsPage from '../pages/Candidate/CandidateApplicationsPage';
import SavedJobsPage from '../pages/Candidate/SavedJobsPage';

// Employer pages
import EmployerDashboard from '../pages/Employer/EmployerDashboard';
import CreateJobPage from '../pages/Employer/CreateJobPage';
import ManageJobsPage from '../pages/Employer/ManageJobsPage';
import CompanyProfilePage from '../pages/Employer/CompanyProfilePage';
import JobApplicationsPage from '../pages/Employer/JobApplicationsPage';

// Admin pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminJobsPage from '../pages/Admin/AdminJobsPage';
import AdminCompaniesPage from '../pages/Admin/AdminCompaniesPage';
import AdminUsersPage from '../pages/Admin/AdminUsersPage';
import AdminLoginPage from '../pages/Admin/AdminLoginPage';

export const routes = [
  // Auth routes - Public
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { index: true, element: <Navigate to="login" replace /> },
    ],
  },
  
  // Home page - Public
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ]
  },
  
  // Jobs & Companies - Public (ai cũng xem được)
  {
    path: '/jobs',
    element: <CommonLayout />,
    children: [
      { index: true, element: <JobsPage /> },
      { path: ':id', element: <JobDetailPage /> }
    ]
  },
  {
    path: '/companies',
    element: <CommonLayout />,
    children: [
      { index: true, element: <CompaniesPage /> },
      { path: ':id', element: <CompanyDetailPage /> }
    ]
  },
  
  // CANDIDATE ROUTES - Protected (chỉ candidate)
  {
    path: '/candidate',
    element: (
      <CandidateRoute>
        <CommonLayout />
      </CandidateRoute>
    ),
    children: [
      { path: 'dashboard', element: <CandidateDashboard /> },
      { path: 'applications', element: <CandidateApplicationsPage /> },
      { path: 'saved-jobs', element: <SavedJobsPage /> }
    ]
  },
  
  // EMPLOYER ROUTES - Protected (chỉ employer)
  {
    path: '/employer',
    element: (
      <EmployerRoute>
        <EmployerLayout />
      </EmployerRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <EmployerDashboard /> },
      { path: 'jobs/create', element: <CreateJobPage /> },
      { path: 'jobs/manage', element: <ManageJobsPage /> },
      { path: 'jobs/:jobId/applications', element: <JobApplicationsPage /> },
      { path: 'company/profile', element: <CompanyProfilePage /> },
    ]
  },
  
  // ADMIN LOGIN - Public (không cần protected)
  {
    path: '/admin/login',
    element: <AdminLoginPage />
  },
  
  // ADMIN ROUTES - Protected (chỉ admin)
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'jobs', element: <AdminJobsPage /> },
      { path: 'companies', element: <AdminCompaniesPage /> },
      { path: 'users', element: <AdminUsersPage /> },
    ]
  },
  
  // Catch-all - Redirect dựa theo role
  { path: '*', element: <Navigate to="/" replace /> },
];