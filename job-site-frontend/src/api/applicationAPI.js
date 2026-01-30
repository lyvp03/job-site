import API from './axiosConfig.js';

export const applicationAPI = {
    // Ứng tuyển vào job
    applyJob: (jobId, formData) => {
        return API.post(`/applications/${jobId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    // Lấy danh sách đơn ứng tuyển của mình (candidate)
    getMyApplications: () => API.get('/applications/me'),
    
    // Lấy danh sách ứng viên apply vào job (employer)
    getJobApplications: (jobId) => API.get(`/applications/${jobId}/applications`),
    
    // Cập nhật trạng thái đơn ứng tuyển (employer)
    updateApplicationStatus: (applicationId, status) => {
        return API.put(`/applications/${applicationId}/status`, { status });
    },
    
    // Download CV
    downloadCV: (cvPath) => {
        // Trả về URL để download hoặc mở trong tab mới
        return `${API.defaults.baseURL}/${cvPath}`;
    }
};