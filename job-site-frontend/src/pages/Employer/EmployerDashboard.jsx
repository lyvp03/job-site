import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI } from '../../api/jobAPI';
import { applicationAPI } from '../../api/applicationAPI';
import StatsCard from '../../components/common/StatsCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch my jobs
                const jobsResponse = await jobAPI.getMyJobs();
                const jobs = jobsResponse.data?.jobs || [];
                
                // Calculate stats
                const activeJobs = jobs.filter(job => {
                    const deadline = new Date(job.deadline);
                    return deadline > new Date();
                });

                // Fetch applications for all jobs
                let allApplications = [];
                for (const job of jobs) {
                    try {
                        const appResponse = await applicationAPI.getJobApplications(job._id);
                        allApplications = [...allApplications, ...(appResponse.data?.data || [])];
                    } catch (err) {
                        console.error(`Error fetching applications for job ${job._id}:`, err);
                    }
                }

                const pendingApps = allApplications.filter(app => app.status === 'pending');

                setStats({
                    totalJobs: jobs.length,
                    activeJobs: activeJobs.length,
                    totalApplications: allApplications.length,
                    pendingApplications: pendingApps.length,
                });

                // Set recent jobs (top 5)
                setRecentJobs(jobs.slice(0, 5));

                // Set recent applications (top 5)
                setRecentApplications(allApplications.slice(0, 5));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
            reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800' },
            accepted: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-800' },
            rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">
                    Chào mừng trở lại! 
                </h1>
                <p className="text-blue-100">
                    Quản lý tin tuyển dụng và ứng viên của bạn tại đây
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Tổng tin đăng"
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
                    title="Tổng ứng viên"
                    value={stats.totalApplications}
                    icon=""
                    color="purple"
                />
                <StatsCard
                    title="Chờ duyệt"
                    value={stats.pendingApplications}
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
                            onClick={() => navigate('/employer/jobs/create')}
                            variant="primary"
                            className="w-full py-4"
                        >
                             Đăng tin tuyển dụng mới
                        </Button>
                        <Button
                            onClick={() => navigate('/employer/jobs/manage')}
                            variant="outline"
                            className="w-full py-4"
                        >
                             Quản lý tin đã đăng
                        </Button>
                        <Button
                            onClick={() => navigate('/employer/company/profile')}
                            variant="outline"
                            className="w-full py-4"
                        >
                             Cập nhật hồ sơ công ty
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Jobs */}
                <Card>
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Tin tuyển dụng gần đây</h2>
                            <Link
                                to="/employer/jobs/manage"
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {recentJobs.length > 0 ? (
                            <div className="space-y-3">
                                {recentJobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => navigate(`/jobs/${job._id}`)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                new Date(job.deadline) > new Date()
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {new Date(job.deadline) > new Date() ? 'Đang tuyển' : 'Hết hạn'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span> {job.location?.city || 'N/A'}</span>
                                            <span> {job.salary?.min || 'N/A'} - {job.salary?.max || 'N/A'}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Hạn nộp: {formatDate(job.deadline)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="mb-3"></p>
                                <p>Chưa có tin tuyển dụng nào</p>
                                <Button
                                    onClick={() => navigate('/employer/jobs/create')}
                                    variant="primary"
                                    size="sm"
                                    className="mt-4"
                                >
                                    Đăng tin ngay
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Recent Applications */}
                <Card>
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Ứng viên mới nhất</h2>
                            <Link
                                to="/employer/jobs/manage"
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {recentApplications.length > 0 ? (
                            <div className="space-y-3">
                                {recentApplications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {app.candidate?.name || 'Ứng viên'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {app.job?.title || 'N/A'}
                                                </p>
                                            </div>
                                            {getStatusBadge(app.status)}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span> {app.candidate?.email || 'N/A'}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Ứng tuyển: {formatDate(app.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="mb-3"></p>
                                <p>Chưa có ứng viên nào ứng tuyển</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default EmployerDashboard;