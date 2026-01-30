import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../api/jobAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';

const AdminJobsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = jobs.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredJobs(filtered);
        } else {
            setFilteredJobs(jobs);
        }
        setCurrentPage(1);
    }, [searchTerm, jobs]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await jobAPI.getPublicJobs({ limit: 1000 });
            const jobs = response.data?.jobs || response.data?.data || [];
            setJobs(jobs);
        } catch (err) {
            setError('Không thể tải danh sách jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId, jobTitle) => {
        if (!window.confirm(`Xác nhận xóa tin: "${jobTitle}"?`)) return;

        try {
            await jobAPI.deleteJob(jobId);
            setSuccess('Xóa tin tuyển dụng thành công');
            // Remove from list immediately
            setJobs(prev => prev.filter(j => j._id !== jobId));
        } catch (err) {
            setError(err.response?.data?.message || 'Xóa thất bại');
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

    const isExpired = (deadline) => {
        return new Date(deadline) <= new Date();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Quản lý tin tuyển dụng</h1>
                <p className="text-gray-300 mt-2">Tổng cộng: {jobs.length} tin tuyển dụng</p>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Search */}
            <Card>
                <Card.Body>
                    <Input
                        placeholder=" Tìm kiếm theo tiêu đề hoặc công ty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Card.Body>
            </Card>

            {/* Jobs Table */}
            {filteredJobs.length === 0 ? (
                <Card>
                    <Card.Body>
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm ? ' Không tìm thấy kết quả' : ' Chưa có tin tuyển dụng nào'}
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <Card>
                    <Card.Body>
                        {/* Pagination Info */}
                        <div className="mb-4 text-sm text-gray-600">
                            Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredJobs.length)} - {Math.min(currentPage * itemsPerPage, filteredJobs.length)} trên {filteredJobs.length} tin tuyển dụng
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900" style={{width: '50px'}}>STT</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tiêu đề</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Công ty</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Địa điểm</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ngày đăng</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Hạn nộp</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((job, index) => (
                                        <tr key={job._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{job.title}</div>
                                                <div className="text-sm text-gray-500"> {job.views || 0} lượt xem</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {job.companyName}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {job.location?.city}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {formatDate(job.createdAt)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {formatDate(job.deadline)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    isExpired(job.deadline)
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {isExpired(job.deadline) ? 'Hết hạn' : 'Đang tuyển'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/jobs/${job._id}`)}
                                                    >
                                                        Xem️
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(job._id, job.title)}
                                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                                    >
                                                        Xoá
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {filteredJobs.length > itemsPerPage && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredJobs.length / itemsPerPage)}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default AdminJobsPage;