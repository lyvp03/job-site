import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api/authAPI';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Container from '../common/Container';
import RadioGroup from '../common/RadioGroup';

const RegisterForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'candidate',
    password: '',
    confirmPassword: ''
  });

  // Role options for RadioGroup
  const roleOptions = [
    { value: 'candidate', label: 'Ứng viên' },
    { value: 'employer', label: 'Nhà tuyển dụng' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role change
  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...registerData } = formData;

      // Call BE API
      const response = await authAPI.register(registerData);

      if (response.data.token) {
        // Login user automatically after registration
        login(response.data.user, response.data.token);
        setSuccess('Đăng ký thành công! Đang chuyển hướng...');
        
        // Redirect based on user role
        setTimeout(() => {
          const role = response.data.user?.role;
          if (role === 'employer') {
            window.location.href = '/employer/dashboard';
          } else if (role === 'admin') {
            window.location.href = '/admin/dashboard';
          } else {
            // Default to candidate dashboard
            window.location.href = '/candidate/dashboard';
          }
        }, 2000);
      }
    } catch (err) {
      // Handle API errors
      const errorMessage = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-m-screen flex items-center justify-center py-8 ">
        <Card className="w-full max-w-3xl" shadow="lg">
          <Card.Header>
            <div className="text-center">
              <h1 className="text-2xl font-bold #155dfc">Chào mừng bạn đến với 5Jobs</h1>
              <p className="text-gray-600 mt-2">Tạo tài khoản mới</p>
            </div>
          </Card.Header>

          <Card.Body>
            {/* Error Alert */}
            {error && (
              <Alert type="error" className="mb-4">
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert type="success" className="mb-4">
                {success}
              </Alert>
            )}
            {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bạn là
                </label>
                <RadioGroup
                  options={roleOptions}
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                />
              </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <Input
                label="Họ và tên"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn A"
                required
              />
              

              {/* Email Input */}
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />

              

              {/* Password Input */}
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                helperText="Mật khẩu ít nhất 6 ký tự, có ít nhất 1 chữ và 1 số"
              />

              {/* Confirm Password Input */}
              <Input
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <a 
                  href="/login" 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Đăng nhập
                </a>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>

  );
};

export default RegisterForm;