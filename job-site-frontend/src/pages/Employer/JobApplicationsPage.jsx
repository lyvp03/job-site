import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../api/applicationAPI';
import { jobAPI } from '../../api/jobAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const JobApplicationsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [jobInfo, setJobInfo] = useState(null);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, [jobId]);

    useEffect(() => {
        filterApplications();
    }, [filter, applications]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch job info
            const jobResponse = await jobAPI.getJobById(jobId);
            setJobInfo(jobResponse.data?.job || jobResponse.data?.data);

            // Fetch applications
            const appsResponse = await applicationAPI.getJobApplications(jobId);
            console.log('Applications response:', appsResponse); // Debug
            setApplications(appsResponse.data?.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.response?.data?.message || 'Không thể tải dữ liệu');
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

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await applicationAPI.updateApplicationStatus(applicationId, newStatus);
            setSuccess('Cập nhật trạng thái thành công');
            fetchData(); // Reload data
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
            reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800', icon: '' },
            accepted: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-800', icon: '' },
            rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: '' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.color} inline-flex items-center gap-1`}>
                <span>{config.icon}</span>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const mb = (bytes / (1024 * 1024)).toFixed(2);
        return `${mb} MB`;
    };

    const handleViewCV = async (applicationId) => {
        if (!applicationId) {
            alert('Không thể xem CV');
            return;
        }
        
        try {
            // Hardcode URL cho nhanh
            const apiUrl = 'http://localhost:5000';
            const token = localStorage.getItem('token');
            
            // Fetch CV with token
            const response = await fetch(`${apiUrl}/api/applications/${applicationId}/cv`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải CV');
            }

            // Get blob and create URL
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Open in new tab
            window.open(url, '_blank');
            
            // Clean up
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
            
        } catch (error) {
            console.error('View CV error:', error);
            alert('Không thể xem CV. Vui lòng thử lại.');
        }
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
        <div className="space-y-6">
            {/* Header with Job Info */}
            <div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/employer/jobs/manage')}
                    className="mb-4"
                >
                    ← Quay lại
                </Button>
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <h1 className="text-2xl font-bold mb-2">Ứng viên ứng tuyển</h1>
                    {jobInfo && (
                        <div className="space-y-1 text-blue-100">
                            <p className="text-lg font-medium">{jobInfo.title}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span> {jobInfo.companyName}</span>
                                <span> {jobInfo.location?.city}</span>
                                <span> {applications.length} ứng viên</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

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
                            <p className="text-gray-600">
                                {filter === 'all' 
                                    ? 'Chưa có ứng viên nào ứng tuyển'
                                    : 'Không có ứng viên với trạng thái này'
                                }
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredApps.map((app) => (
                        <Card key={app._id} className="hover:shadow-lg transition-shadow">
                            <Card.Body>
                                <div className="space-y-4">
                                    {/* Candidate Info */}
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-gray-200">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                                                    
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {app.candidate?.name || 'N/A'}
                                                    </h3>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <span></span>
                                                            <span>{app.candidate?.email || 'N/A'}</span>
                                                        </div>
                                                        {app.candidate?.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <span></span>
                                                                <span>{app.candidate.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Application Date */}
                                            <div className="text-sm text-gray-500">
                                                 Ứng tuyển: {formatDate(app.createdAt)}
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div>
                                            {getStatusBadge(app.status)}
                                        </div>
                                    </div>

                                    {/* CV Info */}
                                    {app.resume && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">CV đính kèm</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div>Tên file: {app.resume.originalName || 'N/A'}</div>
                                                
                                            </div>
                                        </div>
                                    )}

                                    {/* Cover Letter */}
                                    {(app.coverLetter || app.resume?.coverLetter) && (
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Thư xin việc</h4>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {app.coverLetter || app.resume?.coverLetter}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleViewCV(app._id)}
                                            disabled={!app.resume?.path}
                                        >
                                             Xem CV
                                        </Button>

                                        {app.status !== 'reviewing' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange(app._id, 'reviewing')}
                                            >
                                                 Đang xem xét
                                            </Button>
                                        )}

                                        {app.status !== 'accepted' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange(app._id, 'accepted')}
                                                className="text-green-600 border-green-300 hover:bg-green-50"
                                            >
                                                 Chấp nhận
                                            </Button>
                                        )}

                                        {app.status !== 'rejected' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStatusChange(app._id, 'rejected')}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                 Từ chối
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobApplicationsPage;