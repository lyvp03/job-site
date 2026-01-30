import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Dot, Building2, Calendar, Hourglass, TrendingUp, Code, Shield, Umbrella, Monitor, BookOpen } from 'lucide-react';
import { jobAPI } from '../../api/jobAPI';
import { userAPI } from '../../api/userAPI';
import { companyAPI } from '../../api/companyAPI';
import { applicationAPI } from '../../api/applicationAPI'; 
import { mapJobData } from '../../utils/mapJobData';
import Button from '../../components/common/Button';
import CompanyCardNew from '../../components/common/CompanyCardNew';
import JobCard from '../../components/common/JobCard';
import ApplyJobModal from '../../components/common/ApplyJobModal'; 

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [similarJobs, setSimilarJobs] = useState([]);
    const [similarJobsLoading, setSimilarJobsLoading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false); 

    // handle apply
    const handleApply = async () => {
        if (!job) return;
        
        // check login
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth/login', { 
                state: { 
                    redirectTo: `/jobs/${id}`,
                    message: 'Vui lòng đăng nhập để ứng tuyển' 
                } 
            });
            return;
        }
        
        // open modal
        setShowApplyModal(true);
    };

    // handle submit application
    const handleSubmitApplication = async ({ coverLetter, resume }) => {
        try {
            setIsApplying(true);
            
            // create FormData
            const formData = new FormData();
            formData.append('resume', resume);
            if (coverLetter) {
                formData.append('coverLetter', coverLetter);
            }
            
            // call API
            const response = await applicationAPI.applyJob(id, formData);
            
            console.log('Application response:', response);
            
            // close modal
            setShowApplyModal(false);
            
    
            alert(`Ứng tuyển vào vị trí "${job.title}" thành công! Nhà tuyển dụng sẽ xem xét đơn của bạn.`);
            
        } catch (err) {
            console.error('Lỗi khi ứng tuyển:', err);
            
            // handle err
            if (err.response?.status === 400) {
                if (err.response.data.message.includes('applied')) {
                    alert('Bạn đã ứng tuyển vào vị trí này rồi!');
                } else if (err.response.data.message.includes('expired')) {
                    alert('Công việc này đã hết hạn ứng tuyển!');
                } else {
                    alert(err.response.data.message || 'Có lỗi xảy ra khi ứng tuyển');
                }
            } else if (err.response?.status === 403) {
                alert('Chỉ ứng viên mới có thể ứng tuyển!');
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        } finally {
            setIsApplying(false);
        }
    };

    // handle save job
    const handleSaveJob = async () => {
        if (!job) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/auth/login', { 
                    state: { 
                        redirectTo: `/jobs/${id}`,
                        message: 'Vui lòng đăng nhập để lưu tin tuyển dụng' 
                    } 
                });
                return;
            }
            
            if (isSaved) {
                // Unsave job
                await userAPI.unsaveJob(id);
                setIsSaved(false);
                alert(`Đã bỏ lưu tin "${job.title}"`);
            } else {
                // Save job
                await userAPI.saveJob(id);
                setIsSaved(true);
                alert(`Đã lưu tin "${job.title}" thành công!`);
            }
        } catch (err) {
            console.error('Lỗi khi lưu/bỏ lưu tin:', err);
            if (err.response?.status === 400) {
                alert(err.response.data.message || 'Công việc này đã được lưu rồi!');
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        }
    };

    // handle share job
    const handleShare = () => {
        if (!job) return;
        
        const jobTitle = job.title;
        const jobUrl = window.location.href;
        const shareText = `Cơ hội việc làm hấp dẫn: ${jobTitle}\n\n${job.companyName} đang tuyển dụng vị trí ${job.title} với mức lương ${job.salary} tại ${job.location}.\n\nXem chi tiết tại: ${jobUrl}`;
        
        if (navigator.share) {
            navigator.share({
                title: jobTitle,
                text: shareText,
                url: jobUrl,
            })
            .then(() => console.log('Chia sẻ thành công'))
            .catch((error) => {
                console.log('Lỗi khi chia sẻ:', error);
                copyToClipboard(shareText);
            });
        } else {
            copyToClipboard(shareText);
        }
    };

    //  helper copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Đã sao chép thông tin công việc vào clipboard! Bạn có thể chia sẻ qua bất kỳ ứng dụng nào.');
            })
            .catch(err => {
                console.error('Lỗi khi copy:', err);
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        alert('Đã sao chép thông tin công việc vào clipboard!');
                    } else {
                        alert('Không thể sao chép. Vui lòng sao chép thủ công.');
                    }
                } catch (err) {
                    console.error('Fallback copy error:', err);
                    alert('Vui lòng sao chép thủ công: ' + text);
                }
                document.body.removeChild(textArea);
            });
    };

    // Fetch job details
    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await jobAPI.getJobById(id);
                console.log('API Response:', response);
                
                // Handle both response formats
                const jobData = response.data?.job || response.data?.data || response.data;
                const mappedData = mapJobData(jobData);
                console.log('Mapped job data:', mappedData);
                setJob(mappedData);
            } catch (err) {
                console.error('Lỗi khi fetch job', err);
                setError(err.message || 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    // Check if job is already saved
    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsSaved(false);
                    return;
                }

                const response = await userAPI.getSavedJobs({ limit: 1000 });
                const savedJobIds = response.data?.data?.map(job => job._id) || [];
                setIsSaved(savedJobIds.includes(id));
            } catch (err) {
                console.error('Error checking saved jobs:', err);
                setIsSaved(false);
            }
        };

        if (id) {
            checkIfSaved();
        }
    }, [id]);

    // Fetch company info - use job.company from backend populate or fallback to search
    useEffect(() => {
        const fetchCompanyInfo = async () => {
            if (!job) return;
            
            try {
                let companyData = null;
                
                // First priority: Use company object already populated by backend
                if (job.company && typeof job.company === 'object' && job.company._id) {
                    console.log('Using company data from job.company populate:', job.company);
                    setCompanyInfo(job.company);
                    return;
                }
                
                // Second priority: Try fetching by company ID
                if (job.company && typeof job.company === 'string') {
                    try {
                        const response = await companyAPI.getCompanyById(job.company);
                        if (response.data?.data) {
                            companyData = response.data.data;
                        }
                    } catch (err) {
                        console.error('Error fetching company by ID:', err);
                    }
                }
                
                // Third priority: Search by name as fallback, but validate exact match
                if (!companyData && job.companyName) {
                    try {
                        const response = await companyAPI.getCompanies({ 
                            q: job.companyName,
                            limit: 5  // Get more results to find exact match
                        });
                        
                        if (response.data?.data && response.data.data.length > 0) {
                            // Find exact name match (case-insensitive)
                            const exactMatch = response.data.data.find(
                                c => c.name?.toLowerCase().trim() === job.companyName?.toLowerCase().trim()
                            );
                            companyData = exactMatch || response.data.data[0];
                            console.log('Company found by search:', companyData?.name, 'Match type:', exactMatch ? 'exact' : 'partial');
                        }
                    } catch (err) {
                        console.error('Error searching company by name:', err);
                    }
                }
                
                if (companyData) {
                    console.log('Setting company info:', companyData);
                    setCompanyInfo(companyData);
                } else {
                    console.log('No company data found');
                }
            } catch (error) {
                console.error('Lỗi khi tìm company:', error);
            }
        };

        fetchCompanyInfo();
    }, [job]);

    // Fetch similar jobs
    useEffect(() => {
        const fetchSimilarJobs = async () => {
            setSimilarJobsLoading(true);
            try {
                const response = await jobAPI.getPublicJobs({
                    limit: 3,
                    status: 'active'
                });
                
                let jobs = [];
                if (response.data?.jobs) {
                    jobs = response.data.jobs;
                } else if (Array.isArray(response.data)) {
                    jobs = response.data;
                } else if (response.data) {
                    jobs = [response.data];
                }
                
                const filteredJobs = jobs.filter(job => job._id !== id);
                const mappedJobs = filteredJobs
                    .slice(0, 3)
                    .map(jobData => mapJobData(jobData));
                setSimilarJobs(mappedJobs);
            } catch (err) {
                console.error('Lỗi khi fetch việc làm tương tự:', err);
            } finally {
                setSimilarJobsLoading(false);
            }
        };
        fetchSimilarJobs();
    }, [id]);
    
    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
                        <img src="./image/logo-white.png" alt="logo" />
                    </div>
                </div>
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 mt-6">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#131220] to-[#131220] pt-16 pb-24 md:pt-20 md:pb-32 px-4 md:px-8 overflow-hidden">
                {/* Abstract blurred shapes */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        <div className="flex-1 space-y-6">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-medium backdrop-blur-sm">
                                <Dot className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
                                Đang tuyển dụng
                            </div>
                            
                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                                {job?.title}
                            </h1>
                            
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-white/80 text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    <span className="font-medium">{job?.companyName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{job?.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    <span>{job?.salary}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>{job?.jobType}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                            <Button 
                                onClick={handleApply}
                                className="w-full px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                disabled={isApplying}
                            >
                                {isApplying ? 'Đang xử lý...' : 'Ứng tuyển'}
                            </Button>
                            <Button 
                                onClick={handleSaveJob}
                                variant="ghost"
                                className="w-full px-8 h-12 border border-white/20 text-white hover:bg-white/10"
                            >
                                {isSaved ? 'Đã lưu' : 'Lưu tin'}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="flex-1 px-4 md:px-8 pb-20 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Main Content */}
                    <main className="lg:col-span-8 flex flex-col gap-6">
                        {/* About Section */}
                        <div className="bg-white dark:bg-[#1E1C30] rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 dark:border-slate-700/50">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                Về công việc
                            </h3>
                            <div className="prose max-w-none text-slate-600 dark:text-slate-300">
                                {job?.description || 'Không có mô tả công việc'}
                            </div>
                        </div>

                        {/* Requirements Section */}
                        <div className="bg-white dark:bg-[#1E1C30] rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 dark:border-slate-700/50">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                                Yêu cầu công việc
                            </h3>
                            <div className="prose max-w-none text-slate-600 dark:text-slate-300">
                                {job?.requirements || 'Không có yêu cầu cụ thể'}
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="bg-white dark:bg-[#1E1C30] rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 dark:border-slate-700/50">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                Quyền lợi & Phúc lợi
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { Icon: Shield, title: 'Bảo hiểm y tế', desc: 'Toàn diện' },
                                    { Icon: Umbrella, title: 'Nghỉ phép không giới hạn', desc: 'Khi cần' },
                                    { Icon: Monitor, title: 'Thiết bị mới', desc: 'Mac hoặc PC' },
                                    { Icon: BookOpen, title: 'Ngân sách đào tạo', desc: '$1,000/năm' },
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-primary/20 transition-colors">
                                        <div className="size-10 rounded-full bg-primary/10 text-primary dark:text-primary flex items-center justify-center flex-shrink-0">
                                            <benefit.Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{benefit.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Company Culture Section */}
                        {companyInfo && (companyInfo.description || companyInfo.overview) && (
                            <div className="bg-white dark:bg-[#1E1C30] rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 dark:border-slate-700/50">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                    Văn hoá công ty
                                </h3>
                                <div className="prose max-w-none text-slate-600 dark:text-slate-300">
                                    <p>{companyInfo.description || companyInfo.overview}</p>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Right Column - Sidebar */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Company Card */}
                        {companyInfo ? (
                            <CompanyCardNew company={companyInfo} />
                        ) : (
                            <div className="bg-white dark:bg-[#1E1C30] rounded-2xl p-6 shadow-soft border-t-4 border-primary border border-slate-100 dark:border-slate-700/50">
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white -mt-12 mx-auto mb-4">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">{job?.companyName}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1 mb-4">Công ty tuyển dụng</p>
                            </div>
                        )}

                        {/* Job Overview */}
                        <div className="bg-white dark:bg-[#1E1C30] rounded-2xl p-6 shadow-soft border border-slate-100 dark:border-slate-700/50">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Thông tin công việc</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">Ngày đăng</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{job?.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Hourglass className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">Kinh nghiệm</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{job?.experience || 'Không yêu cầu'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">Hình thức</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{job?.jobType || 'Toàn thời gian'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">Lượt xem</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{job?.views || 0}</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-slate-100 dark:bg-white/10 my-6"></div>

                            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Công nghệ sử dụng</h4>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    let techList = [];
                                    if (Array.isArray(job?.skills) && job.skills.length > 0) {
                                        techList = job.skills;
                                    } else if (Array.isArray(job?.requirements) && job.requirements.length > 0) {
                                        techList = job.requirements;
                                    } else {
                                        techList = ['React', 'TypeScript', 'Tailwind', 'Node.js', 'MongoDB'];
                                    }
                                    return techList.slice(0, 5).map((tech, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/5">
                                            {typeof tech === 'string' ? tech : tech.name || 'Tech'}
                                        </span>
                                    ));
                                })()}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Similar Jobs Section */}
            <section className="relative bg-slate-50 dark:bg-[#181625] py-16 border-t border-slate-100 dark:border-white/5 overflow-hidden">
                {/* Background gradient blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-purple-300/20 via-blue-500/10 to-transparent blur-3xl -z-10 rounded-full opacity-60"></div>
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                        Việc làm tương tự
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {similarJobsLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white dark:bg-[#1E1C30] rounded-2xl h-80"></div>
                            ))
                        ) : similarJobs.length > 0 ? (
                            similarJobs.map((similarJob) => (
                                <JobCard key={similarJob._id} job={similarJob} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-slate-500 dark:text-slate-400">Không có công việc tương tự</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sticky Apply Bar */}
            <div className="sticky bottom-0 z-40 bg-white/80 dark:bg-[#131220]/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 p-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:flex flex-col">
                        <h4 className="font-bold text-slate-900 dark:text-white">{job?.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{job?.companyName} • {job?.location}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button 
                            onClick={handleSaveJob}
                            variant="ghost"
                            className="flex-1 sm:flex-none h-10 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white font-semibold"
                        >
                            {isSaved ? 'Đã lưu' : 'Lưu'}
                        </Button>
                        <Button 
                            onClick={handleApply}
                            className="flex-1 sm:flex-none h-10 px-6 bg-blue-600 hover:bg-blue-700 text-slate-700 font-bold"
                            disabled={isApplying}
                        >
                            {isApplying ? 'Đang...' : 'Ứng tuyển'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <ApplyJobModal
                isOpen={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                jobTitle={job?.title || ''}
                onSubmit={handleSubmitApplication}
                isSubmitting={isApplying}
            />
        </>
    );
};

export default JobDetailPage;