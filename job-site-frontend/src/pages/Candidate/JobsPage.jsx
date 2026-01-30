import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { jobAPI } from '../../api/jobAPI';
import SearchBar from '../../components/common/SearchBar';
import JobCard from '../../components/common/JobCard';
import Button from '../../components/common/Button';
import CheckboxNew from '../../components/common/Checkbox';
import SelectNew from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import { MapPin, Sparkles, TrendingUp } from 'lucide-react';
//import filters
import JobTypeFilter from "../../components/jobs/JobTypeFilter";
import ExperienceFilter from "../../components/jobs/ExperienceFilter";
import SalaryFilter from "../../components/jobs/SalaryFilter";
import RegionFilter from "../../components/jobs/RegionFilter";
import CityFilter from "../../components/jobs/CityFilter";
import IndustryFilter from "../../components/jobs/IndustryFilter";

const JobPages = () => {
    const { user } = useAuth();
  
    
  
    // State filters
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState('');
    const [selectedSalary, setSelectedSalary] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
    const [searchKeyword, setSearchKeyword] = useState('');

    // State API data
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalAvailableJobs, setTotalAvailableJobs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const jobsPerPage = 6;

    //build params func for API
    const buildApiParams = () => {
        const params = {
            page: currentPage,
            limit: jobsPerPage,
            sort: '-createdAt'
        };

        // Keyword search
        if (searchKeyword) params.keyword = searchKeyword;

        // JobType  
        if (selectedJobTypes.length > 0) {
            // first jobType
            const jobTypeMapping = {
                'full-time': 'full-time',
                'part-time': 'part-time', 
                'remote': 'remote'
            };
            params.jobType = jobTypeMapping[selectedJobTypes[0]] || selectedJobTypes[0];
        }

        // Experience - map frontend values to backend experience enums
        if (selectedExperience) {
            const experienceMapping = {
                '0-2': ['Dưới 1 năm', 'Từ 1-2 năm'],
                '3-5': ['Từ 3-5 năm'],
                '5+': ['Trên 5 năm'],
            };

            const mapped = experienceMapping[selectedExperience];
            if (mapped) {
                // send comma-separated list so backend can accept multiple values
                params.experience = mapped.join(',');
            } else {
                params.experience = selectedExperience;
            }
        }

        // Location 
        if (selectedCity) params.city = selectedCity;
        // region
        if (selectedRegion) params.region = selectedRegion;
        // industry
        if (selectedIndustry && selectedIndustry !== 'All Industries') params.industry = selectedIndustry;

        // Salary - map from FE format to min/max
        if (selectedSalary) {
            const salaryRanges = {
                '0-3': { maxSalary: 3000000 },
                '3-5': { minSalary: 3000000, maxSalary: 5000000 },
                '5-10': { minSalary: 5000000, maxSalary: 10000000 },
                '10-20': { minSalary: 10000000, maxSalary: 20000000 },
                '20+': { minSalary: 20000000 }
            };
            
            const range = salaryRanges[selectedSalary];
            if (range) {
                if (range.minSalary) params.minSalary = range.minSalary;
                if (range.maxSalary) params.maxSalary = range.maxSalary;
            }
        }

        return params;
    };

    // Fetch jobs from API
    const fetchJobs = async () => {
        

        setLoading(true);
        setError(null);
        
        try {
            const params = buildApiParams();
            console.log('Calling API with params:', params);
            
            const response = await jobAPI.getPublicJobs(params);
            console.log('API Response:', response.data);
            
            // update state - handle both formats
            const jobs = response.data?.jobs || response.data?.data || [];
            const totalJobs = response.data?.totalJobs || jobs.length;
            const totalPages = response.data?.totalPages || 1;
            
            setJobs(jobs);
            setTotalJobs(totalJobs);
            setTotalPages(totalPages);
            
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError(err.response?.data?.message || 'Không thể tải danh sách công việc');
            setJobs([]);
            setTotalJobs(0);
        } finally {
            setLoading(false);
        }
    };

    // Fetch total available jobs on mount (jobs with deadline > now)
    useEffect(() => {
        const fetchTotalAvailableJobs = async () => {
            try {
                const response = await jobAPI.getPublicJobs({ limit: 1 });
                setTotalAvailableJobs(response.data?.totalJobs || 0);
            } catch (err) {
                console.error('Error fetching total jobs:', err);
            }
        };
        fetchTotalAvailableJobs();
    }, []);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs();
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedJobTypes, selectedExperience, selectedSalary, selectedRegion, selectedCity, selectedIndustry, searchKeyword, currentPage]);

    // Handle search từ SearchBar
    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
    };

    // Handle filter changes
    const handleExperienceChange = (value) => {
        console.log('Experience changed to:', value);
        setSelectedExperience(value);
        setCurrentPage(1);
    };

    const handleSalaryChange = (value) => {
        console.log('Salary changed to:', value);
        setSelectedSalary(value);
        setCurrentPage(1);
    };

    const handleRegionChange = (value) => {
        console.log('Region changed to:', value);
        setSelectedRegion(value);
        setCurrentPage(1);
    };

    const handleCityChange = (value) => {
        console.log('City changed to:', value);
        setSelectedCity(value);
        setCurrentPage(1);
    };

    const handleIndustryChange = (value) => {
        console.log('Industry changed to:', value);
        setSelectedIndustry(value);
        setCurrentPage(1);
    };

    // Count active filters
    const activeFiltersCount = 
        selectedJobTypes.length + 
        (selectedExperience ? 1 : 0) + 
        (selectedSalary ? 1 : 0) +
        (selectedRegion ? 1 : 0) + 
        (selectedCity ? 1 : 0) +
        (selectedIndustry && selectedIndustry !== 'All Industries' ? 1 : 0) +
        (searchKeyword ? 1 : 0);

    // Apply filters (auto called from useEffect)
    const handleApplyFilters = () => {
        console.log('Applying filters...');
        setCurrentPage(1);
    };

    // Clear all filters
    const handleClearAllFilters = () => {
        setSelectedJobTypes([]);
        setSelectedExperience('');
        setSelectedSalary('');
        setSelectedRegion('');
        setSelectedCity('');
        setSelectedIndustry('All Industries');
        setSearchKeyword('');
        setCurrentPage(1);
    };

    // Pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Hero Section */}
            <div className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 overflow-hidden">
                {/* Decorative Background Blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-full mx-auto px-6 py-12 md:py-16 lg:py-20">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Title - Single Line */}
                        <div className="text-center mb-6">
                            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight whitespace-normal">
                                Tìm kiếm công việc <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">lý tưởng</span>
                            </h1>
                            <p className="text-slate-300 text-base md:text-lg font-normal leading-relaxed mt-4 max-w-3xl mx-auto">
                                Khám phá hàng ngàn cơ hội nghề nghiệp từ các công ty hàng đầu
                            </p>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-center justify-center gap-3 text-slate-300 mb-8">
                            <span className="font-bold text-white text-2xl">{totalAvailableJobs}</span>
                            <span className="text-lg">công việc đang tuyển dụng</span>
                        </div>

                        {/* Modern Search Bar */}
                        <div className="max-w-4xl mx-auto w-full">
                            <SearchBar
                                placeholder="Tìm kiếm vị trí, công ty..."
                                locationPlaceholder="Chọn thành phố"
                                onChange={handleSearch}
                                searchValue={searchKeyword}
                                showLocation={true}
                                variant="modern"
                                className="w-full"
                            />
                        </div>

                        {/* Industry Filter */}
                        <div className="mt-6 flex justify-center">
                            <IndustryFilter 
                                selectedIndustry={selectedIndustry} 
                                onIndustryChange={handleIndustryChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

                {/* Main Content Grid */}
                <div className="relative z-10">
                    <div className="max-w-7xl mx-auto px-3 lg:px-6 py-8 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Sidebar - Filters */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                {/* Filter Header */}
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                       
                                        Bộ lọc
                                    </h2>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={handleClearAllFilters}
                                            className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        >
                                            Xóa ({activeFiltersCount})
                                        </button>
                                    )}
                                </div>

                                {/* Job Type Filter */}
                                <JobTypeFilter
                                    selectedTypes={selectedJobTypes}
                                    onChange={setSelectedJobTypes}
                                />

                                {/* Experience Filter */}
                                <ExperienceFilter
                                    selectedValue={selectedExperience}
                                    onChange={handleExperienceChange}
                                />

                                {/* Salary Filter */}
                                <SalaryFilter
                                    selectedValue={selectedSalary}
                                    onChange={handleSalaryChange}
                                />

                                {/* Region Filter */}
                                <RegionFilter
                                    selectedValue={selectedRegion}
                                    onChange={handleRegionChange}
                                />

                                {/* City Filter */}
                                <CityFilter 
                                    selectedValue={selectedCity}
                                    onChange={handleCityChange}
                                />

                                {/* Apply Button */}
                                <Button 
                                    onClick={handleApplyFilters}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                                >
                                    Áp Dụng Bộ Lọc
                                </Button>
                            </div>
                        </div>

                        {/* Main Content - Job Cards */}
                        <div className="lg:col-span-3 flex gap-8">
                            <div className="flex-1">
                            {/* Sort Controls */}
                            <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                                    Danh sách công việc
                                </h3>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {loading ? 'Đang tìm kiếm...' : error ? '' : `Hiển thị ${totalJobs} kết quả`}
                                </span>
                            </div>

                            {/* Job Results */}
                            {error ? (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                                    <Button 
                                        onClick={fetchJobs}
                                        variant="primary"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Thử Lại
                                    </Button>
                                </div>
                            ) : loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="relative w-12 h-12 mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
                                        <div className="absolute inset-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">Đang tải công việc...</p>
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-5xl mb-4"></div>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">
                                        Không tìm thấy công việc phù hợp
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-500 text-sm mb-6">
                                        Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                                    </p>
                                    <Button 
                                        onClick={handleClearAllFilters}
                                        variant="secondary"
                                    >
                                        Xóa Tất Cả Bộ Lọc
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-8">
                                        {jobs.map(job => (
                                            <div key={job._id || job.id} className="transform transition-all duration-300 hover:scale-105">
                                                <JobCard job={job} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <Pagination 
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    )}
                                </>
                            )}
                            </div>

                            {/* Right Sidebar - Promo Card */}
                            <div className="hidden lg:block w-80">
                                <div className="sticky top-28">
                                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full"></div>
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5" />
                                                Xây dựng CV
                                            </h3>
                                            <p className="text-sm text-white/90 mb-4">
                                                Tìm hiểu những bí quyết viết CV chinh phục Nhà tuyển dụng
                                            </p>
                                            <button className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm w-full">
                                                Tìm hiểu thêm →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

              
            </div>
        </div>
    );
};

export default JobPages;

