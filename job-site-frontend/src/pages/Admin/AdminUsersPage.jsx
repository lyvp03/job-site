import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../api/userAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filterRole, users]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching users...');
            const response = await userAPI.getAllUsers({ limit: 1000 });
            console.log('Users response:', response);
            const usersData = response.data?.data || response.data || [];
            console.log('Users data:', usersData);
            setUsers(usersData);
        } catch (err) {
            console.error('Lỗi fetch users - Full error:', err);
            console.error('Error response:', err.response);
            console.error('Error message:', err.message);
            
            // Fallback: Hiển thị error nếu API chưa được implement
            if (err.response?.status === 404) {
                setError('Endpoint /api/users không tồn tại. Hãy kiểm tra server logs.');
            } else if (err.response?.status === 403) {
                setError('Bạn không có quyền truy cập. Chỉ admin mới có thể quản lý người dùng.');
            } else if (err.response?.status === 401) {
                setError('Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
            } else if (err.response?.data?.message) {
                setError(`Lỗi: ${err.response.data.message}`);
            } else {
                setError(`Không thể tải danh sách người dùng: ${err.message}`);
            }
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterRole) {
            filtered = filtered.filter(user => user.role === filterRole);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleToggleStatus = async (userId, currentStatus, userName) => {
        const action = currentStatus ? 'vô hiệu hoá' : 'kích hoạt';
        if (!window.confirm(`Xác nhận ${action} tài khoản: "${userName}"?`)) return;

        try {
            if (currentStatus) {
                await userAPI.disableUser(userId);
                setSuccess(`Vô hiệu hoá tài khoản "${userName}" thành công`);
            } else {
                await userAPI.enableUser(userId);
                setSuccess(`Kích hoạt tài khoản "${userName}" thành công`);
            }

            // Update in list
            setUsers(prev => prev.map(u => 
                u._id === userId ? { ...u, isActive: !currentStatus } : u
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Xác nhận xóa tài khoản: "${userName}"? Hành động này không thể hoàn tác.`)) return;

        try {
            await userAPI.deleteUser(userId);
            setSuccess(`Xóa tài khoản "${userName}" thành công`);
            setUsers(prev => prev.filter(u => u._id !== userId));
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

    const getRoleLabel = (role) => {
        const roles = {
            candidate: 'Ứng viên',
            employer: 'Nhà tuyển dụng',
            admin: 'Quản trị viên'
        };
        return roles[role] || role;
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
                <h1 className="text-3xl font-bold text-white">Quản lý người dùng</h1>
                <p className="text-gray-300 mt-2">Tổng cộng: {users.length} người dùng</p>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

            {/* Filters */}
            <Card>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả role</option>
                            <option value="candidate">Ứng viên</option>
                            <option value="employer">Nhà tuyển dụng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                </Card.Body>
            </Card>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <Card>
                    <Card.Body>
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm || filterRole ? 'Không tìm thấy kết quả' : 'Chưa có người dùng nào'}
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            ) : (
                <Card>
                    <Card.Body>
                        {/* Pagination Info */}
                        <div className="mb-4 text-sm text-gray-600">
                            Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} trên {filteredUsers.length} người dùng
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900" style={{width: '50px'}}>STT</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tên</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ngày tạo</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user, index) => (
                                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-4 text-center text-sm font-medium text-gray-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'employer' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.isActive ? '✓ Hoạt động' : '✗ Vô hiệu'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant={user.isActive ? "outline" : "primary"}
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(user._id, user.isActive, user.name)}
                                                        className={user.isActive ? "text-orange-600 border-orange-300" : ""}
                                                    >
                                                        {user.isActive ? 'Khoá tài khoản' : '✓'}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(user._id, user.name)}
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
                        {filteredUsers.length > itemsPerPage && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
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

export default AdminUsersPage;