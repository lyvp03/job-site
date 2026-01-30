import API from './axiosConfig';

export const authAPI = {
  // POST /api/auth/register
  register: (userData) => API.post('/auth/register', userData),
  
  // POST /api/auth/login
  login: (credentials) => API.post('/auth/login', credentials),
  
  // GET /api/auth/me
  getMe: () => API.get('/auth/me'),
  
  // Thêm các method khác nếu cần
  logout: () => API.post('/auth/logout'),
  
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, newPassword) => 
    API.post('/auth/reset-password', { token, password: newPassword }),
};