import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../api/jobAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const ManageJobsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, expired
    const [deleteModal, setDeleteModal] = useState({ show: false, jobId: null, jobTitle: '' });
    const [viewJobModal, setViewJobModal] = useState({ show: false, job: null });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [filter, jobs]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await jobAPI.getMyJobs();
            setJobs(response.data?.jobs || []);
        } catch (err) {
            setError('Không thể tải danh sách tin tuyển dụng');
            console.error('Fetch jobs error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = () => {
        const now = new Date();
        let filtered = [...jobs];

        if (filter === 'active') {
            filtered = jobs.filter(job => new Date(job.deadline) > now);
        } else if (filter === 'expired') {
            filtered = jobs.filter(job => new Date(job.deadline) <= now);
        }

        setFilteredJobs(filtered);
    };

    const handleDelete = async (jobId) => {
        try {
            await jobAPI.deleteJob(jobId);
            setSuccess('Xóa tin tuyển dụng thành công');
            setDeleteModal({ show: false, jobId: null, jobTitle: '' });
            fetchJobs();
        } catch (err) {
            setError(err.response?.data?.message || 'Xóa tin thất bại');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Thỏa thuận';
        const min = (salary.min / 1000000).toFixed(0);
        const max = (salary.max / 1000000).toFixed(0);
        return `${min} - ${max} triệu VND`;
    };

    const isExpired = (deadline) => {
        return new Date(deadline) <= new Date();
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý tin tuyển dụng</h1>
                    <p className="text-gray-600 mt-2">Tổng cộng: {jobs.length} tin tuyển dụng</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate('/employer/jobs/create')}
                >
                     Đăng tin mới
                </Button>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Filters */}
            <Card>
                <Card.Body>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'all'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Tất cả ({jobs.length})
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'active'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Đang tuyển ({jobs.filter(j => !isExpired(j.deadline)).length})
                        </button>
                        <button
                            onClick={() => setFilter('expired')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'expired'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Hết hạn ({jobs.filter(j => isExpired(j.deadline)).length})
                        </button>
                    </div>
                </Card.Body>
            </Card>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
                <Card>
                    <Card.Body>
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4"> Chưa có tin tuyển dụng nào</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/employer/jobs/create')}
                            >
                                Đăng tin ngay
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <Card key={job._id} className="hover:shadow-lg transition-shadow">
                            <Card.Body>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {job.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                        isExpired(job.deadline)
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {isExpired(job.deadline) ? ' Hết hạn' : ' Đang tuyển'}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex flex-wrap gap-4">
                                                        <span> {job.companyName}</span>
                                                        <span> {job.location?.city}</span>
                                                        <span> {formatSalary(job.salary)}</span>
                                                        <span> {job.views || 0} lượt xem</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <span> Đăng: {formatDate(job.createdAt)}</span>
                                                        <span> Hạn nộp: {formatDate(job.deadline)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 ml-4">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => navigate(`/employer/jobs/${job._id}/applications`)}
                                        >
                                             Ứng viên
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setViewJobModal({ show: true, job: job })}
                                        >
                                             Xem
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/employer/jobs/edit/${job._id}`)}
                                        >
                                             Sửa
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDeleteModal({
                                                show: true,
                                                jobId: job._id,
                                                jobTitle: job.title
                                            })}
                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full">
                        <Card.Header>
                            <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-gray-600 mb-4">
                                Bạn có chắc chắn muốn xóa tin tuyển dụng:
                            </p>
                            <p className="font-semibold text-gray-900 mb-6">
                                "{deleteModal.jobTitle}"?
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteModal({ show: false, jobId: null, jobTitle: '' })}
                                    className="flex-1"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => handleDelete(deleteModal.jobId)}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    Xóa
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {/* View Job Modal */}
            {viewJobModal.show && viewJobModal.job && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <Card className="max-w-2xl w-full my-8">
                        <Card.Header className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-900">Chi tiết việc làm</h3>
                            <button
                                onClick={() => setViewJobModal({ show: false, job: null })}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewJobModal.job.title}</h2>
                                <p className="text-gray-600 text-lg">{viewJobModal.job.companyName}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Địa điểm</p>
                                    <p className="font-semibold">{viewJobModal.job.location?.city || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Mức lương</p>
                                    <p className="font-semibold">{formatSalary(viewJobModal.job.salary)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Kinh nghiệm</p>
                                    <p className="font-semibold">{viewJobModal.job.experience || 'Không yêu cầu'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Hình thức</p>
                                    <p className="font-semibold">{viewJobModal.job.jobType || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-bold text-gray-900 mb-2">Mô tả công việc</h4>
                                <div className="prose max-w-none text-gray-600 text-sm whitespace-pre-wrap">
                                    {viewJobModal.job.description || 'Không có mô tả'}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-bold text-gray-900 mb-2">Yêu cầu</h4>
                                <div className="prose max-w-none text-gray-600 text-sm whitespace-pre-wrap">
                                    {viewJobModal.job.requirements || 'Không có yêu cầu cụ thể'}
                                </div>
                            </div>

                            <div className="border-t pt-4 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setViewJobModal({ show: false, job: null })}
                                    className="flex-1"
                                >
                                    Đóng
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setViewJobModal({ show: false, job: null });
                                        navigate(`/jobs/${viewJobModal.job._id}`);
                                    }}
                                    className="flex-1"
                                >
                                    Xem công khai
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ManageJobsPage;