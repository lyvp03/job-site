import API from './axiosConfig.js';

export const userAPI = {
    // Admin - Quản lý người dùng
    getAllUsers: (params) => API.get('/users', { params }),
    getUserById: (id) => API.get(`/users/${id}`),
    
    // Admin - Disable/Enable user
    disableUser: (id) => API.put(`/users/${id}/disable`, {}),
    enableUser: (id) => API.put(`/users/${id}/enable`, {}),
    
    // Admin - Delete user
    deleteUser: (id) => API.delete(`/users/${id}`),

    // Candidate - Saved Jobs
    getSavedJobs: (params) => API.get('/users/saved-jobs', { params }),
    saveJob: (jobId) => API.post(`/users/save-job/${jobId}`, {}),
    unsaveJob: (jobId) => API.delete(`/users/save-job/${jobId}`),
};
