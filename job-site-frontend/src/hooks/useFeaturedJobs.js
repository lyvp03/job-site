import { useState, useEffect } from 'react';
import { jobAPI } from '../api/jobAPI';

export const useFeaturedJobs=(limit=10)=>{
    const [jobs, setJobs]=useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);

    const fetchFeaturedJobs=async()=>{
        try{
            setLoading(true);
            setError(null);

            const response=await jobAPI.getPublicJobs({
                limit,
                sort:'-createdAt',
                page:1
            });

            const result=response.data;
            let jobsData=[];

            if(result?.jobs){
                jobsData=result.jobs;
            }else if (Array.isArray(result)) {
                jobsData = result;
            }
            setJobs(jobsData.slice(0, limit));
        }catch (err) {
            const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Không thể tải danh sách việc làm';
            setError(errorMessage);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };
        useEffect(() => {
            fetchFeaturedJobs();
        }, []);
        return { 
        jobs, 
        loading, 
        error, 
        refetch: fetchFeaturedJobs 
    };

};