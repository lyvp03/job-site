import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import { useFeaturedJobs } from '../../hooks/useFeaturedJobs';
import JobCard from '../../components/common/JobCard';
import Button from '../../components/common/Button';
import { companyAPI } from '../../api/companyAPI';

const HomePage=()=>{
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchLoading, setSearchLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState({});
  const { jobs: featuredJobs, loading, error } = useFeaturedJobs(6);

  // Handle post job button click
  const handlePostJobClick = () => {
    if (!user) {
      // Not logged in
      if (window.confirm('Vui lòng đăng ký tài khoản Nhà tuyển dụng để đăng tin')) {
        navigate('/auth/register');
      }
    } else if (user.role !== 'employer') {
      // Logged in but not employer
      if (window.confirm('Vui lòng đăng ký tài khoản Nhà tuyển dụng để đăng tin')) {
        navigate('/auth/register');
      }
    } else {
      // Is employer - navigate to post job page
      navigate('/employer/jobs/create');
    }
  };

  // Fetch companies for marquee
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyAPI.getCompanies();
        const companiesData = response.data?.data || response.data || [];
        const limitedCompanies = companiesData.slice(0, 5);
        setCompanies(limitedCompanies);

        // Fetch jobs count for each company
        const jobCounts = {};
        await Promise.all(
          limitedCompanies.map(async (company) => {
            try {
              const jobsResponse = await companyAPI.getCompanyJobs(company._id);
              const jobs = jobsResponse.data?.data || jobsResponse.data || [];
              jobCounts[company._id] = jobs.length;
            } catch (error) {
              console.error(`Error fetching jobs for company ${company._id}:`, error);
              jobCounts[company._id] = 0;
            }
          })
        );
        setCompanyJobs(jobCounts);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        {/* Logo loading */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
            <img src="./image/logo-white.png" ></img>
          </div>
        </div>
        
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2"></h3>
          <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen w-full">
      {/**Hero section */}
      <section className="relative min-h-screen flex flex-col w-full overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#131220] to-[#131220]">
        {/* Background Gradient Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        

        {/* Main Content */}
        <main className="relative z-10 flex flex-1 flex-col justify-center px-6 lg:px-12 py-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full">
            
            {/* Left Column: Copy & Actions */}
            <div className="flex flex-col gap-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="flex flex-col gap-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">#1 Nền tảng tuyển dụng</span>
                </div>

                {/* Heading */}
                <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                  Tìm kiếm<br className="hidden sm:block" /> nhân tài tốt nhất.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Được tuyển dụng nhanh hơn.</span>
                </h1>

                {/* Description */}
                <p className="text-slate-400 text-lg lg:text-xl font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Kết nối các công ty tuyệt vời với những ứng viên nổi bật. Gợi ý công việc thông minh và quy trình tuyển dụng nhanh chóng được hỗ trợ bởi AI.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/jobs')}
                  className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(37,99,235,0.7)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Tìm việc làm
                </button>
                <button 
                  onClick={handlePostJobClick}
                  className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300 text-base font-bold hover:bg-purple-500/20 transition-all transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Đăng tin tuyển dụng
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-4">
                <div className="flex items-center gap-3 bg-slate-800/30 border border-white/5 rounded-lg p-3 pr-5 backdrop-blur-md">
                  <div className="flex -space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 bg-gradient-to-br from-pink-400 to-pink-600"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">10k+</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold leading-none">Ứng viên</span>
                    <span className="text-xs text-slate-400 mt-1">Được tuyển dụng tháng này</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white leading-none">500+</span>
                  <span className="text-sm text-slate-400">Công ty tin tưởng</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Composition */}
            <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">
              {/* Grid SVG */}
              <svg className="absolute inset-0 w-full h-full text-white/5 z-0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                  </pattern>
                </defs>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
                <line stroke="currentColor" strokeDasharray="5,5" strokeWidth="2" x1="30%" x2="70%" y1="30%" y2="50%"></line>
                <line stroke="currentColor" strokeDasharray="5,5" strokeWidth="2" x1="70%" x2="50%" y1="50%" y2="80%"></line>
                <circle cx="30%" cy="30%" fill="#3b82f6" r="4"></circle>
                <circle cx="70%" cy="50%" fill="#3b82f6" r="4"></circle>
                <circle cx="50%" cy="80%" fill="#3b82f6" r="4"></circle>
              </svg>

              {/* Card 1: Main Candidate Profile */}
              <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-float">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-500 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Ứng viên tiềm năng</h3>
                    <p className="text-sm text-slate-400">Product Designer</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300 border border-white/5">Figma</span>
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300 border border-white/5">React</span>
                  <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300 border border-white/5">UI/UX</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[85%]"></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>Điểm khớp</span>
                  <span className="text-white font-bold">98%</span>
                </div>
              </div>

              {/* Card 2: Job Offer */}
              <div className="absolute z-10 top-[10%] right-[5%] sm:right-[10%] w-[200px] bg-white text-slate-900 rounded-xl p-4 shadow-xl animate-bounce hidden sm:block" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">B</div>
                  <div>
                    <h4 className="text-sm font-bold">TechCorp Inc.</h4>
                    <p className="text-[10px] text-gray-500">Hà Nội</p>
                  </div>
                </div>
                <div className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded w-fit">
                  $120k - $150k
                </div>
              </div>

              {/* Card 3: Success Notification */}
              <div className="absolute z-30 bottom-[15%] left-[0%] sm:left-[10%] bg-slate-900/90 backdrop-blur-md border border-green-500/30 rounded-lg p-3 shadow-lg flex items-center gap-3 animate-bounce hidden sm:flex" style={{animationDelay: '1s'}}>
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Phỏng vấn được lên lịch</p>
                  <p className="text-[10px] text-slate-400">Vừa xong</p>
                </div>
              </div>

              {/* Decorative Circles */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </main>

        {/* Companies Marquee */}
        <div className="relative z-10 w-full py-6 border-t border-white/5 bg-gradient-to-r from-transparent via-slate-900/50 to-transparent backdrop-blur-sm">
          <div className="flex w-full items-center justify-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500">
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <div key={company._id || index} className="relative group">
                  <button
                    onClick={() => navigate(`/companies`)}
                    onMouseEnter={() => setHoveredCompany(company._id)}
                    onMouseLeave={() => setHoveredCompany(null)}
                    className="flex items-center gap-2 text-white/70 hover:text-white font-bold whitespace-nowrap transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                    {company.name}
                  </button>

                  {/* Tooltip */}
                  {hoveredCompany === company._id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-xl z-50 pointer-events-none">
                      <div className="flex flex-col gap-3">
                        {/* Company Name */}
                        <h4 className="text-white font-bold text-sm leading-tight">{company.name}</h4>

                        {/* Industry */}
                        {company.industry && (
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 text-xs font-medium min-w-fit">Ngành:</span>
                            <span className="text-white/80 text-xs">{company.industry}</span>
                          </div>
                        )}

                        {/* Description */}
                        {(company.description || company.overview) && (
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 text-xs font-medium min-w-fit">Giới thiệu:</span>
                            <p className="text-white/70 text-xs line-clamp-2">
                              {company.description || company.overview}
                            </p>
                          </div>
                        )}

                        {/* Job Positions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <span className="text-slate-400 text-xs font-medium">Vị trí tuyển dụng:</span>
                          <span className="text-blue-400 font-bold text-sm">{companyJobs[company._id] || 0}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800/95 border-r border-b border-white/20 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-2 text-white/70 font-bold whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Công ty Cổ phần Test
                </div>
                <div className="flex items-center gap-2 text-white/70 font-bold whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Công ty Cổ phần ABX
                </div>
                <div className="flex items-center gap-2 text-white/70 font-bold whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  G
                </div>
                <div className="flex items-center gap-2 text-white/70 font-bold whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  GreenLife
                </div>
                <div className="hidden sm:flex items-center gap-2 text-white/70 font-bold whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  FlowState
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/**Featured Jobs section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {/* SearchBar */}
          <div className="flex justify-center mb-12">
            <SearchBar />
          </div>

          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Việc làm <span className="text-blue-600">Nổi bật</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Khám phá những cơ hội nghề nghiệp hấp dẫn nhất được cập nhật hàng ngày
            </p>
          </div>

          {/* Error State */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <p className="text-gray-500 mt-2">Không thể tải danh sách việc làm, vui lòng thử lại sau</p>
            </div>
          ) : (
            <>
              {/* Job Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredJobs.length > 0 ? (
                  featuredJobs.map((job) => (
                    <JobCard key={job._id || job.id} job={job} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">Chưa có việc làm nổi bật</p>
                  </div>
                )}
              </div>

              {/* View All Button */}
              {featuredJobs.length > 0 && (
                <div className="text-center">
                  <button 
                    onClick={() => navigate('/jobs')}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Xem tất cả việc làm
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;