import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../api/jobAPI';
import { companyAPI } from '../../api/companyAPI';
import { applicationAPI } from '../../api/applicationAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatsCard from '../../components/common/StatsCard';
import Alert from '../../components/common/Alert';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalCompanies: 0,
        totalApplications: 0
    });

    const [recentJobs, setRecentJobs] = useState([]);
    const [recentCompanies, setRecentCompanies] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch jobs
            const jobsResponse = await jobAPI.getPublicJobs({ limit: 100 });
            const jobs = jobsResponse.data?.jobs || jobsResponse.data?.data || [];
            
            const activeJobs = jobs.filter(job => {
                const deadline = new Date(job.deadline);
                return deadline > new Date();
            });

            // Fetch companies
            const companiesResponse = await companyAPI.getCompanies({ limit: 100 });
            const companies = companiesResponse.data?.data || [];

            setStats({
                totalJobs: jobs.length,
                activeJobs: activeJobs.length,
                totalCompanies: companies.length,
                totalApplications: 0 // Không có API tổng hợp
            });

            // Recent data
            setRecentJobs(jobs.slice(0, 5));
            setRecentCompanies(companies.slice(0, 5));

        } catch (err) {
            console.error('Fetch dashboard error:', err);
            setError('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('vi-VN');
        } catch (error) {
            return 'N/A';
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;
        
        try {
            await jobAPI.deleteJob(jobId);
            fetchDashboardData(); // Reload
            alert('Đã xóa thành công');
        } catch (err) {
            alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard </h1>
                <p className="text-purple-100">Quản lý hệ thống 5Jobs</p>
            </div>

            {error && <Alert type="error">{error}</Alert>}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                    title="Tổng tin tuyển dụng"
                    value={stats.totalJobs}
                    icon=""
                    color="blue"
                />
                <StatsCard
                    title="Tin đang tuyển"
                    value={stats.activeJobs}
                    icon=""
                    color="green"
                />
                <StatsCard
                    title="Tổng công ty"
                    value={stats.totalCompanies}
                    icon=""
                    color="purple"
                />
                <StatsCard
                    title="Tổng ứng tuyển"
                    value={stats.totalApplications}
                    icon=""
                    color="yellow"
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <Card.Header>
                    <h2 className="text-xl font-bold text-gray-900">Thao tác nhanh</h2>
                </Card.Header>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            onClick={() => navigate('/admin/jobs')}
                            variant="outline"
                            className="w-full py-4"
                        >
                             Quản lý tin tuyển dụng
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/companies')}
                            variant="outline"
                            className="w-full py-4"
                        >
                             Quản lý công ty
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/users')}
                            variant="outline"
                            className="w-full py-4"
                        >
                             Quản lý người dùng
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Jobs */}
                <Card>
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Tin tuyển dụng mới</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/admin/jobs')}
                            >
                                Xem tất cả →
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {recentJobs.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Chưa có tin nào</p>
                        ) : (
                            <div className="space-y-3">
                                {recentJobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {job.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                     {job.companyName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Đăng: {formatDate(job.createdAt)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                Xoá
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Recent Companies */}
                <Card>
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Công ty mới</h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/admin/companies')}
                            >
                                Xem tất cả →
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {recentCompanies.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Chưa có công ty nào</p>
                        ) : (
                            <div className="space-y-3">
                                {recentCompanies.map((company) => (
                                    <div
                                        key={company._id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-all cursor-pointer"
                                        onClick={() => navigate(`/companies/${company._id}`)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {company.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                     {company.city}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                     {company.industry}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {company.isVerified && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                            ✓ Đã xác minh
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            {/* System Info */}
            <Card className="bg-gray-50 border-gray-200">
                <Card.Body>
                    <div className="flex items-start gap-4">
                        <div className="text-4xl"></div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Thông tin hệ thống</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>• Version: 1.0.0</p>
                                <p>• Database: MongoDB</p>
                                <p>• Last update: {formatDate(new Date())}</p>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminDashboard;