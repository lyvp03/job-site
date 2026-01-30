import { useState, useCallback } from 'react';
import { jobAPI } from '../api/jobAPI';

export const useJobs = (initialParams = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    totalJobs: 0,
    limit: 10
  });

  const fetchJobs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await jobAPI.getPublicJobs(params);
      const result = response.data;
      
      // update jobs
      if (result?.jobs) {
        setJobs(result.jobs);
      } else if (Array.isArray(result)) {
        setJobs(result);
      }
      
      // Cập nhật pagination nếu có
      if (result?.totalPages) {
        setPagination({
          page: result.currentPage || 1,
          totalPages: result.totalPages,
          totalJobs: result.totalJobs,
          limit: result.limit || 10
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Lỗi tải danh sách việc làm';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    jobs,
    loading,
    error,
    pagination,
    fetchJobs,
    setJobs
  };
};