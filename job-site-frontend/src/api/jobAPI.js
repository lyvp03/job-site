import API from './axiosConfig.js';

export const jobAPI={
    
   // Cho cả UV và NTD
  getPublicJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  
  // Chỉ cho NTD
  createJob: (jobData) => API.post('/jobs', jobData),
  updateJob: (id, jobData) => API.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: () => API.get('/jobs/my-jobs'), // Jobs của NTD
  
  // Cho UV
  applyJob: (jobId, application) => API.post(`/jobs/${jobId}/apply`, application),
  //getAppliedJobs: () => API.get('/jobs/applied'),
  //saveJob: (jobId) => API.post(`/jobs/${jobId}/save`),
  //getSavedJobs: () => API.get('/jobs/saved'),

}