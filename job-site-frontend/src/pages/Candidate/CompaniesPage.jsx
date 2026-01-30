import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { companyAPI } from '../../api/companyAPI';
import CompanyCardNew from '../../components/common/CompanyCardNew';
import Pagination from '../../components/common/Pagination';
import IndustryFilter from '../../components/jobs/IndustryFilter';

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch with large limit to get all companies, or implement pagination
        const response = await companyAPI.getCompanies({ limit: 1000 });
        const companiesData = response.data?.data || response.data || [];
        
        // Fetch jobs for each company to get accurate job count
        const companiesWithJobs = await Promise.all(
          companiesData.map(async (company, index) => {
            try {
              const jobsResponse = await companyAPI.getCompanyJobs(company._id);
              const jobs = jobsResponse.data?.data || jobsResponse.data || [];
              return {
                ...company,
                jobs: jobs,
                activeJobs: jobs.length,
                isHiring: jobs.length > 0,
                isFeatured: index % 4 === 0,
                isRemote: index % 3 === 0,
                fundingStage: company.fundingStatus || ['Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'IPO'][Math.floor(Math.random() * 6)],
                bannerImage: company.bannerImage || [
                  'linear-gradient(135deg, #584be2 0%, #AB81CD 100%)',
                  'linear-gradient(135deg, #222A68 0%, #333399 100%)',
                  'linear-gradient(135deg, #E2ADF2 0%, #C084FC 100%)'
                ][index % 3]
              };
            } catch (jobError) {
              console.error(`Error fetching jobs for company ${company._id}:`, jobError);
              return {
                ...company,
                jobs: [],
                activeJobs: 0,
                isHiring: false,
                isFeatured: index % 4 === 0,
                isRemote: index % 3 === 0,
                fundingStage: company.fundingStatus || ['Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'IPO'][Math.floor(Math.random() * 6)],
                bannerImage: company.bannerImage || [
                  'linear-gradient(135deg, #584be2 0%, #AB81CD 100%)',
                  'linear-gradient(135deg, #222A68 0%, #333399 100%)',
                  'linear-gradient(135deg, #E2ADF2 0%, #C084FC 100%)'
                ][index % 3]
              };
            }
          })
        );
        
        setCompanies(companiesWithJobs);
        setFilteredCompanies(companiesWithJobs);
        setCurrentPage(1);
      } catch (error) {
        console.error('Lỗi khi fetch companies:', error);
        setError('Không thể tải danh sách công ty. Vui lòng thử lại sau.');
        setCompanies([]);
        setFilteredCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search and industry
  useEffect(() => {
    let filtered = companies;

    // Filter by industry
    if (selectedIndustry !== 'All Industries') {
      filtered = filtered.filter(company =>
        company.industry?.includes(selectedIndustry)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(company =>
        company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by location
    if (locationQuery.trim()) {
      filtered = filtered.filter(company =>
        company.city?.toLowerCase().includes(locationQuery.toLowerCase()) ||
        company.location?.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [searchQuery, locationQuery, selectedIndustry, companies]);

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSearch = (e) => {
    setLocationQuery(e.target.value);
  };

  const handleIndustryFilter = (industry) => {
    setSelectedIndustry(industry);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePagination = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Đang tải công ty...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
     

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/50 dark:to-transparent pt-12 pb-8 px-4 md:pt-16 md:pb-12">
          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-gradient-to-b from-purple-300/30 via-blue-500/15 to-transparent blur-3xl -z-10 rounded-full opacity-80"></div>
          <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-gradient-to-t from-blue-400/20 to-transparent blur-3xl -z-10 rounded-full"></div>

          <div className="max-w-[1000px] mx-auto text-center flex flex-col gap-6 items-center">
            {/* Hero Title */}
            <div className="flex flex-col gap-4 max-w-2xl">
              <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight whitespace-nowrap">
                Tìm kiếm công ty <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">phù hợp</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg font-normal leading-relaxed">
                Khám phá những công ty hàng đầu với nhiều công việc hấp dẫn.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-[780px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-3 rounded-2xl shadow-2xl shadow-blue-500/20 border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row gap-3 mt-3 hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-300">
              <div className="flex-1 flex items-center px-4 h-12 md:h-14 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-600 rounded-lg md:rounded-none">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-slate-400 text-base"
                  placeholder="Tìm kiếm công ty hoặc từ khóa"
                />
              </div>
              <div className="flex-1 flex items-center px-4 h-12 md:h-14 rounded-lg md:rounded-none">
                <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={handleLocationSearch}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-slate-400 text-base"
                  placeholder="Thành phố, tỉnh hoặc Remote"
                />
              </div>
              <button className="h-12 md:h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105 active:scale-95">
                Tìm kiếm
              </button>
            </div>

            {/* Filter Chips */}
            <div className="mt-6">
              <IndustryFilter 
                selectedIndustry={selectedIndustry} 
                onIndustryChange={handleIndustryFilter}
              />
            </div>

            {/* Results Count */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Company Grid Section */}
        {!error && (
          <section className="w-full max-w-[1280px] px-4 py-12 flex flex-col gap-8 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-3xl my-8 md:my-12 border border-white/50 dark:border-slate-700/50">
            <div className="flex items-baseline justify-between px-4 md:px-8">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Công ty nổi bật
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Hiển thị {filteredCompanies.length} kết quả
              </span>
            </div>

            {paginatedCompanies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
                  {paginatedCompanies.map(company => (
                    <CompanyCardNew key={company._id || company.id} company={company} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePagination}
                  className="mt-8"
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400 text-lg">Không tìm thấy công ty nào</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default CompaniesPage;
                                