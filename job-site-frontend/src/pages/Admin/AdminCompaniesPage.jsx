import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../../api/companyAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';

const AdminCompaniesPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = companies.filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCompanies(filtered);
        } else {
            setFilteredCompanies(companies);
        }
        setCurrentPage(1);
    }, [searchTerm, companies]);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await companyAPI.getCompanies({ limit: 1000 });
            setCompanies(response.data?.data || response.data || []);
        } catch (err) {
            setError('Không thể tải danh sách công ty');
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

    const handleToggleStatus = async (companyId, currentStatus, companyName) => {
        const action = currentStatus ? 'vô hiệu hoá' : 'kích hoạt';
        if (!window.confirm(`Xác nhận ${action} công ty: "${companyName}"?`)) return;

        try {
            // Call API to update status
            const response = await companyAPI.updateCompany(companyId, { isActive: !currentStatus });
            
            if (response.data?.success || response.status === 200) {
                setSuccess(`${currentStatus ? 'Vô hiệu hoá' : 'Kích hoạt'} công ty thành công`);
                
                // Update in list with fresh data from server
                const updatedCompany = response.data?.data;
                if (updatedCompany) {
                    setCompanies(prev => prev.map(c => 
                        c._id === companyId ? updatedCompany : c
                    ));
                } else {
                    // Fallback if no data in response
                    setCompanies(prev => prev.map(c => 
                        c._id === companyId ? { ...c, isActive: !currentStatus } : c
                    ));
                }
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Cập nhật thất bại';
            setError(errorMsg);
            console.error('Toggle status error:', err);
            
            // Clear error message after 3 seconds
            setTimeout(() => setError(''), 3000);
        }
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
                <h1 className="text-3xl font-bold text-white">Quản lý công ty</h1>
                <p className="text-gray-300 mt-2">Tổng cộng: {companies.length} công ty</p>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Search */}
            <Card>
                <Card.Body>
                    <Input
                        placeholder=" Tìm kiếm theo tên công ty hoặc ngành nghề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Card.Body>
            </Card>

            {/* Companies Grid */}
            {filteredCompanies.length === 0 ? (
                <Card>
                    <Card.Body>
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm ? ' Không tìm thấy kết quả' : ' Chưa có công ty nào'}
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <Card>
                    <Card.Body>
                        <div className="mb-4 text-sm text-gray-600">
                            Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCompanies.length)} - {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} trên {filteredCompanies.length} công ty
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900" style={{width: '50px'}}>STT</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tên công ty</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ngành nghề</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Địa điểm</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Quy mô</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ngày tạo</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((company, index) => (
                                        <tr key={company._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{company.name}</div>
                                                {company.isVerified && (
                                                    <div className="text-xs text-green-600">✓ Đã xác minh</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {company.industry || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {company.city || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {company.size || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    company.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {company.isActive ? '✓ Hoạt động' : '✗ Vô hiệu'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {formatDate(company.createdAt)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/companies/${company._id}`)}
                                                    >
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        variant={company.isActive ? "outline" : "primary"}
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(company._id, company.isActive, company.name)}
                                                        className={company.isActive ? "text-orange-600 border-orange-300" : ""}
                                                    >
                                                        {company.isActive ? 'Vô hiệu' : 'Kích hoạt'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {filteredCompanies.length > itemsPerPage && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredCompanies.length / itemsPerPage)}
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

export default AdminCompaniesPage;