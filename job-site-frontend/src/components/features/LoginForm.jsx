import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api/authAPI';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Container from '../common/Container';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Call BE API login
      const response = await authAPI.login(formData);

      if (response.data.token) {
        const { user, token } = response.data;
        
        // Save to AuthContext vand localStorage
        login(user, token);
        
        
        // route
        let targetRoute;
        if (user.role === "candidate") {
          targetRoute = '/candidate/dashboard';

        } else if (user.role === "employer") {
          targetRoute = '/employer/dashboard';

        } else {
          targetRoute = '/';

        }
        
        // Navigate with small delay make sure state updated
        setTimeout(() => {

          navigate(targetRoute, { replace: true });
        }, 100);
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      console.error("❌ Error response:", err.response);
      
      // Handle API errors
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container size="sm">
      <div className="min-m-screen flex items-center justify-center py-12">
        <Card className="w-full max-w-lg" shadow="lg">
          <Card.Header>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Chào mừng bạn đã quay trở lại</h1>
              <p className="text-gray-600 mt-2">Đăng nhập vào tài khoản</p>
            </div>
          </Card.Header>

          <Card.Body>
            {/* Error Alert */}
            {error && (
              <Alert type="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <a 
                  href="/auth/register" 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default LoginForm;