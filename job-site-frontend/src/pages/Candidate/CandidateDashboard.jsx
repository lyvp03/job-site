import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../api/applicationAPI';
import { jobAPI } from '../../api/jobAPI';
import { userAPI } from '../../api/userAPI';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import StatsCard from '../../components/common/StatsCard';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        reviewing: 0,
        accepted: 0,
        rejected: 0,
        recentUpdates: 0 
    });
    
    const [applications, setApplications] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch applications
            const appResponse = await applicationAPI.getMyApplications();
            const apps = appResponse.data?.data || [];
            setApplications(apps.slice(0, 5)); // Show 5 recent

            // Calculate stats
            const statsData = {
                total: apps.length,
                pending: apps.filter(a => a.status === 'pending').length,
                reviewing: apps.filter(a => a.status === 'reviewing').length,
                accepted: apps.filter(a => a.status === 'accepted').length,
                rejected: apps.filter(a => a.status === 'rejected').length,
                recentUpdates: apps.filter(a => {
                    const isRecent = a.updatedAt && (Date.now() - new Date(a.updatedAt).getTime()) < 24 * 60 * 60 * 1000;
                    return a.status !== 'pending' && isRecent;
                }).length
            };
            setStats(statsData);

            // Fetch recommended jobs
            const jobsResponse = await jobAPI.getPublicJobs({ limit: 4 });
            const jobs = jobsResponse.data?.jobs || jobsResponse.data?.data || [];
            setRecommendedJobs(jobs);

            // Fetch saved jobs
            const savedJobsResponse = await userAPI.getSavedJobs({ limit: 5 });
            const savedJobsList = savedJobsResponse.data?.data || [];
            setSavedJobs(savedJobsList);

        } catch (err) {
            console.error('Fetch dashboard error:', err);
            setError('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Thỏa thuận';
        const min = (salary.min / 1000000).toFixed(0);
        const max = (salary.max / 1000000).toFixed(0);
        return `${min} - ${max} triệu`;
    };

    const getStatusBadge = (status, updatedAt) => {
        const statusConfig = {
            pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: '' },
            reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800', icon: '' },
            accepted: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-800', icon: '' },
            rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: '' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        
        // Check if updated within last 24 hours
        const isRecentUpdate = updatedAt && (Date.now() - new Date(updatedAt).getTime()) < 24 * 60 * 60 * 1000;
        const showNewBadge = status !== 'pending' && isRecentUpdate;
        
        return (
            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color} inline-flex items-center gap-1`}>
                    <span>{config.icon}</span>
                    {config.label}
                </span>
                {showNewBadge && (
                    <span className="animate-pulse px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                        MỚI
                    </span>
                )}
            </div>
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
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Xin chào, {user?.name || 'Ứng viên'}! 
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Chúc bạn may mắn trong hành trình tìm kiếm công việc mơ ước
                        </p>
                    </div>
                    {stats.recentUpdates > 0 && (
                        <div className="bg-white text-primary-600 px-4 py-2 rounded-full font-bold animate-pulse">
                             {stats.recentUpdates} cập nhật mới
                        </div>
                    )}
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert type="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Stats Overview */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tổng quan đơn ứng tuyển</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <StatsCard
                        title="Tổng đơn"
                        value={stats.total}
                        icon=""
                        color="blue"
                    />
                    <StatsCard
                        title="Chờ duyệt"
                        value={stats.pending}
                        icon=""
                        color="yellow"
                    />
                    <StatsCard
                        title="Đang xem xét"
                        value={stats.reviewing}
                        icon=""
                        color="purple"
                    />
                    <StatsCard
                        title="Đã chấp nhận"
                        value={stats.accepted}
                        icon=""
                        color="green"
                    />
                    <StatsCard
                        title="Đã từ chối"
                        value={stats.rejected}
                        icon=""
                        color="red"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications */}
                <div className="lg:col-span-2">
                    <Card>
                        <Card.Header>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Đơn ứng tuyển gần đây</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/candidate/applications')}
                                >
                                    Xem tất cả →
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {applications.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-2"></p>
                                    <p className="text-gray-600 mb-4">Bạn chưa ứng tuyển công việc nào</p>
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        Tìm việc ngay
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((app) => {
                                        const isRecentUpdate = app.updatedAt && (Date.now() - new Date(app.updatedAt).getTime()) < 24 * 60 * 60 * 1000;
                                        const hasStatusUpdate = app.status !== 'pending' && isRecentUpdate;
                                        
                                        return (
                                            <div
                                                key={app._id}
                                                className={`p-4 border rounded-lg hover:border-primary-300 hover:shadow-md transition-all cursor-pointer ${
                                                    hasStatusUpdate ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-400' : 'border-gray-200'
                                                }`}
                                                onClick={() => navigate(`/jobs/${app.job?._id}`)}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {app.job?.title || 'N/A'}
                                                            </h3>
                                                            {hasStatusUpdate && (
                                                                <span className="animate-pulse text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold">
                                                                     MỚI
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                            <span> {app.job?.location?.city || 'N/A'}</span>
                                                            <span> {formatSalary(app.job?.salary)}</span>
                                                            <span> {app.job?.jobType || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(app.status, app.updatedAt)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Ứng tuyển: {formatDate(app.createdAt)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-xl font-bold text-gray-900">Thao tác nhanh</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full justify-center"
                                    onClick={() => navigate('/jobs')}
                                >
                                     Tìm việc làm
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center"
                                    onClick={() => navigate('/candidate/applications')}
                                >
                                     Xem đơn đã nộp
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center"
                                    onClick={() => navigate('/candidate/saved-jobs')}
                                >
                                     Tin đã lưu
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center"
                                    onClick={() => navigate('/companies')}
                                >
                                     Thông tin công ty
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Recommended Jobs */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-xl font-bold text-gray-900">Tin đã lưu</h2>
                        </Card.Header>
                        <Card.Body>
                            {savedJobs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Chưa lưu công việc nào</p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate('/jobs')}
                                    >
                                        Khám phá công việc →
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {savedJobs.map((job) => (
                                        <div
                                            key={job._id}
                                            className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                                            onClick={() => navigate(`/jobs/${job._id}`)}
                                        >
                                            <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                                {job.title}
                                            </h4>
                                            <div className="space-y-1 text-xs text-gray-600">
                                                <div>Công ty: {job.companyName}</div>
                                                <div> Địa điểm: {job.location?.city}</div>
                                                <div> Mức lương: {formatSalary(job.salary)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-4"
                                onClick={() => navigate('/candidate/saved-jobs')}
                            >
                                Xem tất cả →
                            </Button>
                        </Card.Body>
                    </Card>

                    {/* Recommended Jobs */}
                    <Card>
                        <Card.Header>
                            <h2 className="text-xl font-bold text-gray-900">Việc làm phù hợp</h2>
                        </Card.Header>
                        <Card.Body>
                            {recommendedJobs.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">Chưa có gợi ý</p>
                            ) : (
                                <div className="space-y-3">
                                    {recommendedJobs.map((job) => (
                                        <div
                                            key={job._id}
                                            className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                                            onClick={() => navigate(`/jobs/${job._id}`)}
                                        >
                                            <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                                                {job.title}
                                            </h4>
                                            <div className="space-y-1 text-xs text-gray-600">
                                                <div>Tên công ty: {job.companyName}</div>
                                                <div> Địa điểm: {job.location?.city}</div>
                                                <div> Mức lương: {formatSalary(job.salary)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-4"
                                onClick={() => navigate('/jobs')}
                            >
                                Xem thêm →
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Tips Section */}
            <Card className="bg-blue-50 border-blue-200">
                <Card.Body>
                    <div className="flex items-start gap-4">
                        <div className="text-4xl"></div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Mẹo tìm việc hiệu quả</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li> Cập nhật CV thường xuyên để tăng cơ hội được chú ý</li>
                                <li> Viết thư xin việc cá nhân hóa cho từng vị trí</li>
                                <li> Theo dõi trạng thái đơn và phản hồi kịp thời</li>
                                <li> Nghiên cứu kỹ về công ty trước khi ứng tuyển</li>
                            </ul>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CandidateDashboard;