import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, Users, ExternalLink, CheckCircle, Plus, Check, Share2, TrendingUp, Globe, BookOpen, DollarSign, Clock, Calendar, Rocket } from 'lucide-react';
import { companyAPI } from '../../api/companyAPI';
import JobCard from "../../components/common/JobCard"
import CompanyCardNew from "../../components/common/CompanyCardNew"
import './CompanyDetailPage.module.css';

const CompanyDetailPage = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await companyAPI.getCompanyById(id);
                setCompany(response.data.data);
            } catch (error) {
                console.error('Error fetching company:', error);
                setError(error.response?.data?.message || 'Failed to load company');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompany();
        }
    }, [id]);

    useEffect(() => {
        const fetchCompanyJobs = async () => {
            if (!company) return;
            
            setJobsLoading(true);
            try {
                const response = await companyAPI.getCompanyJobs(id);
                setJobs(response.data.data || []);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setJobsLoading(false);
            }
        };

        fetchCompanyJobs();
    }, [company, id]);

    // Handle share company
    const handleShare = () => {
        if (!company) return;
        
        const companyUrl = window.location.href;
        const shareText = `Tìm hiểu về ${company.name}\n\n${company.overview || company.description || 'Công ty hàng đầu'}\n\nXem chi tiết tại: ${companyUrl}`;
        
        if (navigator.share) {
            navigator.share({
                title: company.name,
                text: shareText,
                url: companyUrl,
            })
            .then(() => console.log('Chia sẻ thành công'))
            .catch((error) => {
                console.log('Lỗi khi chia sẻ:', error);
                copyToClipboard(companyUrl);
            });
        } else {
            copyToClipboard(companyUrl);
        }
    };

    // Helper copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Đã sao chép link vào clipboard!');
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
                        alert('Đã sao chép link vào clipboard!');
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-2">Lỗi</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <Link to="/companies" className="text-primary hover:text-secondary">Quay lại công ty</Link>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-2">Không tìm thấy công ty</h2>
                    <Link to="/companies" className="text-primary hover:text-secondary">Quay lại công ty</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
           

            <main className="flex-grow">
                {/* Hero Section with Gradient - Dark Theme */}
                <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#131220] to-[#131220] pt-16 pb-24 md:pt-20 md:pb-32 px-4 md:px-8 overflow-hidden">
                    {/* Abstract blurred shapes */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                            {/* Logo */}
                            <div className="relative shrink-0 order-first md:order-none">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center p-2 border-4 border-white dark:border-[#1E1C30] group-hover:shadow-3xl group-hover:shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-1 relative overflow-hidden">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-500" onError={(e) => {
                                            e.target.style.display = 'none';
                                            if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                                        }}/>
                                    ) : null}
                                    <div className={`w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-4xl ${company.logo ? 'hidden' : 'flex'}`}>
                                        {company.name ? (
                                            company.name.split(' ').length > 1
                                                ? (company.name.split(' ')[0][0] + company.name.split(' ')[company.name.split(' ').length - 1][0]).toUpperCase()
                                                : company.name.substring(0, 2).toUpperCase()
                                        ) : '?'}
                                    </div>
                                </div>
                                {company.isVerified && (
                                    <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-[#1E1C30] flex items-center gap-1">
                                        <CheckCircle size={14} />
                                        Đã xác minh
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-6">
                                {/* Company Name & Status */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                                        {company.name}
                                    </h1>
                                    
                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-white/80 text-sm md:text-base">
                                        {company.industry && (
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-5 h-5" />
                                                <span className="font-medium">{company.industry}</span>
                                            </div>
                                        )}
                                        {(company.city || company.address) && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-5 h-5" />
                                                <span>{company.address && `${company.address}, `}{company.city || 'Việt Nam'}</span>
                                            </div>
                                        )}
                                        {company.size && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-5 h-5" />
                                                <span>{company.size}</span>
                                            </div>
                                        )}
                                        {company.website && (
                                            <div className="flex items-center gap-2">
                                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors flex items-center gap-1">
                                                    🌐 {company.website.replace(/(https?:\/\/)?(www\.)?/, '')}
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Overview */}
                                {company.overview && (
                                    <p className="text-base md:text-lg text-white/80 max-w-3xl leading-relaxed">
                                        {company.overview}
                                    </p>
                                )}
                            </div>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-3 w-full md:w-auto min-w-[220px]">
                                <button 
                                    onClick={() => setIsFollowing(!isFollowing)}
                                    className={`w-full px-8 h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 ${
                                        isFollowing 
                                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                                    }`}
                                >
                                    {isFollowing ? <Check size={20} /> : <Plus size={20} />}
                                    {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                                </button>
                                <button className="w-full px-8 h-12 rounded-xl border border-white/20 text-white hover:bg-white/10 font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:border-white/40" onClick={handleShare}>
                                    <Share2 size={20} />
                                    Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-12 md:pt-16 relative z-10">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Tabs */}
                            <div className="flex gap-8 border-b border-gray-200 dark:border-white/10 overflow-x-auto no-scrollbar bg-gradient-to-r from-transparent via-transparent to-transparent pb-0">
                                {[
                                    { id: 'overview', label: 'Tổng quan' },
                                    { id: 'culture', label: 'Văn hóa công ty' },
                                    { id: 'jobs', label: 'Công việc', count: jobs.length },
                                    { id: 'perks', label: 'Quyền lợi' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`pb-4 px-2 border-b-2 whitespace-nowrap transition-all duration-300 relative group ${
                                            activeTab === tab.id
                                                ? 'border-gradient-to-r border-primary text-primary font-bold'
                                                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-medium hover:text-primary dark:hover:text-accent'
                                        }`}
                                    >
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span className="ml-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary dark:text-accent text-xs px-2 py-0.5 rounded-full group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">{tab.count}</span>
                                        )}
                                        {activeTab === tab.id && <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>}
                                    </button>
                                ))}
                            </div>

                            {/* About Section */}
                            {activeTab === 'overview' && (
                                <section>
                                    <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4 flex items-center gap-2">
                                        <span className="w-2 h-8 bg-secondary rounded-full"></span>
                                        Về {company.name}
                                    </h2>
                                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1E1C30] dark:to-[#252330] p-6 rounded-2xl shadow-md dark:shadow-lg dark:shadow-black/20 border border-gray-100 dark:border-white/5 space-y-4 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                                            {company.overview || 'Không có thông tin mô tả.'}
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Culture Section */}
                            {activeTab === 'culture' && (
                                <section>
                                    <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4 flex items-center gap-2">
                                        <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                        Văn hóa công ty
                                    </h2>
                                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1E1C30] dark:to-[#252330] p-6 rounded-2xl shadow-md dark:shadow-lg dark:shadow-black/20 border border-gray-100 dark:border-white/5 space-y-4 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                                            {company.description || 'Không có thông tin mô tả.'}
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Perks Section */}
                            {activeTab === 'perks' && (
                                <section>
                                    <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4 flex items-center gap-2">
                                        <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                        Quyền lợi & Phúc lợi
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: TrendingUp, title: 'Cơ hội phát triển', desc: 'Phát triển kỹ năng và sự nghiệp' },
                                            { icon: Clock, title: 'Linh hoạt thời gian', desc: 'Đồng ý về giờ làm việc' },
                                            { icon: Globe, title: 'Môi trường quốc tế', desc: 'Làm việc với đội toàn cầu' },
                                            { icon: BookOpen, title: 'Đào tạo & Phát triển', desc: 'Trợ cấp khóa học chuyên nghiệp' },
                                        ].map((perk, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-white dark:bg-[#1E1C30] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                                <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center text-primary">
                                                    <perk.icon size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">{perk.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{perk.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Open Positions */}
                            {(activeTab === 'jobs' || activeTab === 'overview') && (
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-primary-dark dark:text-white flex items-center gap-2">
                                            <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                                            Vị trí tuyển dụng
                                        </h2>
                                        <a href="#" className="text-primary text-sm font-bold hover:underline">Xem tất cả ({jobs.length})</a>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {jobsLoading ? (
                                            <div className="flex justify-center py-12 col-span-full">
                                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary"></div>
                                            </div>
                                        ) : jobs.length > 0 ? (
                                            jobs.slice(0, 6).map((job) => (
                                                <JobCard key={job._id || job.id} job={job} />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 col-span-full">
                                                <Briefcase size={72} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Không có vị trí tuyển dụng</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                                    )}
                        </div>

                        {/* Right Column: Sidebar */}
                        <aside className="space-y-6">
                            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1E1C30] dark:to-[#252330] p-6 rounded-xl shadow-lg dark:shadow-xl dark:shadow-black/20 border border-gray-100 dark:border-white/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">Thông tin công ty</h3>
                                <div className="space-y-4">
                                    {company.foundedYear && (
                                        <div className="flex items-start gap-3 group/info">
                                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary p-2 rounded-lg group-hover/info:from-primary/40 group-hover/info:to-secondary/40 transition-all duration-300">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Thành lập</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{company.foundedYear}</p>
                                            </div>
                                        </div>
                                    )}
                                    {company.size && (
                                        <div className="flex items-start gap-3 group/info">
                                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary p-2 rounded-lg group-hover/info:from-primary/40 group-hover/info:to-secondary/40 transition-all duration-300">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Quy mô công ty</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{company.size}</p>
                                            </div>
                                        </div>
                                    )}
                                    {company.fundingStatus && (
                                        <div className="flex items-start gap-3 group/info">
                                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary p-2 rounded-lg group-hover/info:from-primary/40 group-hover/info:to-secondary/40 transition-all duration-300">
                                                <DollarSign size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Vốn tài trợ</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{company.fundingStatus}</p>
                                            </div>
                                        </div>
                                    )}
                                    <hr className="border-gray-100 dark:border-white/5"/>
                                    <div className="pt-2">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Công nghệ sử dụng</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">React</span>
                                            <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">Node.js</span>
                                            <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">Golang</span>
                                            <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">AWS</span>
                                            <span className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">PostgreSQL</span>
                                        </div>
                                    </div>
                                </div>
                                    <div className="mt-6 flex gap-2">
                                        {company.website && (
                                            <a 
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white py-3 rounded-lg text-center text-sm font-bold border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                                            >
                                                Trang web
                                            </a>
                                        )}
                                        {company.socialLinks?.linkedin && (
                                            <a 
                                                href={company.socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-[#0077b5] hover:bg-[#005885] text-white py-3 rounded-lg text-center text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 active:scale-95 shadow-sm"
                                            >
                                                LinkedIn
                                            </a>
                                        )}
                                    </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">Công ty tương tự</h3>
                                <div className="space-y-3">
                                    {[
                                        { _id: '1', name: 'Momo', industry: 'FinTech', city: 'Hà Nội' },
                                        { _id: '2', name: 'Grab', industry: 'Technology', city: 'TP.HCM' },
                                        { _id: '3', name: 'Tiki', industry: 'E-Commerce', city: 'Hà Nội' },
                                    ].map((similar) => (
                                        <div key={similar._id}>
                                            <CompanyCardNew company={similar} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="bg-gradient-to-r from-[#1E1C30] via-primary/10 to-[#1E1C30] text-white py-12 mt-12 border-t border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(88,75,226,0.1),transparent)]"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary opacity-10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
                    <div className="max-w-[960px] mx-auto px-4 text-center relative z-10">
                        <div className="size-16 bg-gradient-to-tr from-primary via-secondary to-accent rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/50 mx-auto mb-6 group hover:scale-110 transition-transform duration-300 animate-bounce">
                            <Rocket size={32} className="group-hover:rotate-12 transition-transform duration-300" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">Sẵn sàng gia nhập {company.name}?</h2>
                        <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">Chúng tôi luôn tìm kiếm những cá nhân tài năng để gia nhập đội của chúng tôi. Nếu bạn không thấy vị trí phù hợp, vui lòng liên hệ với chúng tôi.</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link to="/jobs" className="bg-gradient-to-r from-white to-gray-100 text-primary-dark hover:shadow-2xl hover:shadow-white/20 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
                                Xem tất cả công việc
                            </Link>
                            <button className="bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm">
                                Tham gia mạng lưới tài năng
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};



export default CompanyDetailPage;