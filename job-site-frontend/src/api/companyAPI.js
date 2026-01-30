import API from './axiosConfig.js';

export const companyAPI = {
    
    // Public - Cho tất cả người dùng
    getCompanies: (params) => API.get('/companies', { params }),
    getCompanyById: (id) => API.get(`/companies/${id}`),
    getCompanyJobs: (id, params) => API.get(`/companies/${id}/jobs`, { params }),
    
    // Private - Chỉ cho Employer (NTD)
    createCompany: (companyData) => API.post('/companies', companyData),
    updateCompany: (id, companyData) => API.put(`/companies/${id}`, companyData),
    getMyCompanies: () => API.get('/companies/my-companies'),
    
    // File upload
    uploadCompanyLogo: (id, formData) => {
        return API.post(`/companies/${id}/logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};