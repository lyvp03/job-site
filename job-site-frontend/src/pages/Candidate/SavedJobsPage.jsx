import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../api/userAPI';
import { useAuth } from '../../contexts/AuthContext';
import JobCard from '../../components/common/JobCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { Bookmark } from 'lucide-react';

const SavedJobsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savedJobs, setSavedJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const jobsPerPage = 6;

    useEffect(() => {
        fetchSavedJobs();
    }, [currentPage]);

    const fetchSavedJobs = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await userAPI.getSavedJobs({
                page: currentPage,
                limit: jobsPerPage
            });
            setSavedJobs(response.data?.data || []);
            setTotalPages(response.data?.totalPages || 1);
        } catch (err) {
            console.error('Error fetching saved jobs:', err);
            setError('Không thể tải tin đã lưu');
            setSavedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSavedJob = async (jobId) => {
        try {
            await userAPI.unsaveJob(jobId);
            fetchSavedJobs();
        } catch (err) {
            console.error('Error removing saved job:', err);
            setError('Không thể bỏ lưu công việc');
        }
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Thỏa thuận';
        const min = (salary.min / 1000000).toFixed(0);
        const max = (salary.max / 1000000).toFixed(0);
        return `${min} - ${max} triệu`;
    };

    if (loading && savedJobs.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải tin đã lưu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
           

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center w-full">
                <div className="max-w-7xl w-full px-4 py-12">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {savedJobs.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
                            <Bookmark className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Chưa lưu công việc nào
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Khám phá các công việc phù hợp và lưu lại để xem lại sau
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/jobs')}
                                className="mx-auto"
                            >
                                Khám phá công việc →
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    Danh sách tin đã lưu
                                </h2>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {savedJobs.length} công việc
                                </span>
                            </div>

                            {/* Jobs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {savedJobs.map((job) => (
                                    <div key={job._id} className="relative group">
                                        <JobCard
                                            job={job}
                                            onClick={() => navigate(`/jobs/${job._id}`)}
                                        />
                                        <button
                                            onClick={() => handleRemoveSavedJob(job._id)}
                                            className="absolute top-3 right-3 bg-white dark:bg-slate-700 rounded-full p-2 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all opacity-0 group-hover:opacity-100"
                                            title="Bỏ lưu"
                                        >
                                            <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    className="mt-8"
                                />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SavedJobsPage;
