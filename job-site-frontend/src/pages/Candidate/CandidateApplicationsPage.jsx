import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../api/applicationAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { formatDateToDDMMYYYY as formatDate } from '../../utils/dateFormatter';

const CandidateApplicationsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, reviewing, accepted, rejected
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [filter, applications]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await applicationAPI.getMyApplications();
            setApplications(response.data?.data || []);
        } catch (err) {
            console.error('Fetch applications error:', err);
            setError('Không thể tải danh sách đơn ứng tuyển');
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        if (filter === 'all') {
            setFilteredApps(applications);
        } else {
            setFilteredApps(applications.filter(app => app.status === filter));
        }
    };

    const handleViewResume = (app) => {
        try {
            let resumeUrl = '';
            
            // Thử các path có thể
            if (app.resume?.path) {
                resumeUrl = app.resume.path;
            } else if (app.resume?.url) {
                resumeUrl = app.resume.url;
            } else if (typeof app.resume === 'string') {
                resumeUrl = app.resume;
            }

            // Nếu là path tương đối, thêm domain
            if (resumeUrl && !resumeUrl.startsWith('http')) {
                const baseUrl = process.env.REACT_APP_API_URL || window.location.origin;
                resumeUrl = `${baseUrl}${resumeUrl.startsWith('/') ? '' : '/'}${resumeUrl}`;
            }

            if (resumeUrl) {
                window.open(resumeUrl, '_blank');
            } else {
                alert('CV không khả dụng');
            }
        } catch (err) {
            console.error('Lỗi khi mở CV:', err);
            alert('Không thể mở CV');
        }
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
            reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800', icon: '', isNew: true },
            accepted: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-800', icon: '', isNew: true },
            rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: '', isNew: true }
        };

        const config = statusConfig[status] || statusConfig.pending;
        
        // Check if updated within last 24 hours (trạng thái mới)
        const isRecentUpdate = updatedAt && (Date.now() - new Date(updatedAt).getTime()) < 24 * 60 * 60 * 1000;
        const showNewBadge = config.isNew && isRecentUpdate;
        
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

    const getStatusCount = (status) => {
        if (status === 'all') return applications.length;
        return applications.filter(app => app.status === status).length;
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
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Đơn ứng tuyển của tôi</h1>
                    <p className="text-gray-600 mt-2">
                        Tổng cộng: {applications.length} đơn ứng tuyển
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate('/jobs')}
                >
                     Tìm việc mới
                </Button>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert type="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <Card.Body>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'all'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Tất cả ({getStatusCount('all')})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'pending'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                             Chờ duyệt ({getStatusCount('pending')})
                        </button>
                        <button
                            onClick={() => setFilter('reviewing')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'reviewing'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                             Đang xem xét ({getStatusCount('reviewing')})
                        </button>
                        <button
                            onClick={() => setFilter('accepted')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'accepted'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                             Đã chấp nhận ({getStatusCount('accepted')})
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'rejected'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                             Đã từ chối ({getStatusCount('rejected')})
                        </button>
                    </div>
                </Card.Body>
            </Card>

            {/* Applications List */}
            {filteredApps.length === 0 ? (
                <Card>
                    <Card.Body>
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-2"></p>
                            <p className="text-gray-600 mb-4">
                                {filter === 'all' 
                                    ? 'Bạn chưa ứng tuyển công việc nào'
                                    : `Không có đơn ứng tuyển với trạng thái này`
                                }
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/jobs')}
                            >
                                Tìm việc ngay
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredApps.map((app) => {
                        // Check if status changed recently (within 24h)
                        const isRecentUpdate = app.updatedAt && (Date.now() - new Date(app.updatedAt).getTime()) < 24 * 60 * 60 * 1000;
                        const hasStatusUpdate = app.status !== 'pending' && isRecentUpdate;
                        
                        return (
                            <Card 
                                key={app._id} 
                                className={`hover:shadow-lg transition-shadow ${
                                    hasStatusUpdate ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                                }`}
                            >
                                <Card.Body>
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        {/* Job Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-xl font-semibold text-gray-900">
                                                            {app.job?.title || 'N/A'}
                                                        </h3>
                                                        {hasStatusUpdate && (
                                                            <span className="animate-pulse text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold">
                                                                 CẬP NHẬT MỚI
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <span></span>
                                                            <span>{app.job?.location?.city || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span></span>
                                                            <span>{formatSalary(app.job?.salary)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span></span>
                                                            <span>{app.job?.jobType || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span></span>
                                                            <span>Hạn nộp: {app.job?.deadline ? formatDate(app.job.deadline) : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Application Info */}
                                            <div className={`rounded-lg p-3 space-y-2 ${
                                                hasStatusUpdate ? 'bg-white border-2 border-blue-300' : 'bg-gray-50'
                                            }`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Trạng thái:</span>
                                                    {getStatusBadge(app.status, app.updatedAt)}
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Ngày nộp:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {formatDate(app.createdAt)}
                                                    </span>
                                                </div>
                                                {app.updatedAt && app.updatedAt !== app.createdAt && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">Cập nhật:</span>
                                                        <span className="font-medium text-blue-600">
                                                            {formatDate(app.updatedAt)}
                                                        </span>
                                                    </div>
                                                )}
                                                {app.coverLetter && (
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <p className="text-sm text-gray-600 mb-1">Thư xin việc:</p>
                                                        <p className="text-sm text-gray-900 line-clamp-2">
                                                            {app.coverLetter}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex lg:flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/jobs/${app.job?._id}`)}
                                                className="flex-1 lg:flex-none"
                                            >
                                                 Xem tin
                                            </Button>
                                            {app.resume && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewResume(app)}
                                                    className="flex-1 lg:flex-none"
                                                >
                                                     Xem CV
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CandidateApplicationsPage;