import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../../api/companyAPI';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { industries } from '../../utils/industries';
import { cities } from '../../utils/cities';
import { Upload, X, Building2 } from 'lucide-react';

const CompanyProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hasCompany, setHasCompany] = useState(false);
    const [companyId, setCompanyId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        district: '',
        region: 'Miền Bắc',
        description: '',
        overview: '',
        industry: '',
        size: '1-10',
        foundedYear: new Date().getFullYear(),
        logo: '',
        socialLinks: {
            facebook: '',
            linkedin: '',
            twitter: '',
            youtube: ''
        }
    });

    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    const fetchCompanyProfile = async () => {
        setLoading(true);
        try {
            const response = await companyAPI.getMyCompanies();
            
            if (response.data?.companies && response.data.companies.length > 0) {
                const company = response.data.companies[0];
                setHasCompany(true);
                setCompanyId(company._id);
                
                // Map all fields from company to formData structure
                setFormData({
                    name: company.name || '',
                    email: company.email || '',
                    phone: company.phone || '',
                    website: company.website || '',
                    address: company.address || '',
                    city: company.city || '',
                    district: company.district || '',
                    region: company.region || 'Miền Bắc',
                    description: company.description || '',
                    overview: company.overview || '',
                    industry: company.industry || '',
                    size: company.size || '1-10',
                    foundedYear: company.foundedYear || new Date().getFullYear(),
                    logo: company.logo || '',
                    socialLinks: {
                        facebook: company.socialLinks?.facebook || '',
                        linkedin: company.socialLinks?.linkedin || '',
                        twitter: company.socialLinks?.twitter || '',
                        youtube: company.socialLinks?.youtube || ''
                    }
                });
                
                if (company.logo) {
                    // Resolve logo URL if it's a relative path
                    let logoUrl = company.logo;
                    if (logoUrl && !logoUrl.startsWith('http')) {
                        const baseUrl = process.env.REACT_APP_API_URL || window.location.origin;
                        logoUrl = `${baseUrl}${logoUrl.startsWith('/') ? '' : '/'}${logoUrl}`;
                    }
                    setImagePreview(logoUrl);
                }
            }
        } catch (err) {
            console.log('No company yet or error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WEBP');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        setImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setError('');
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, logo: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        if (!formData.name || formData.name.length < 2) {
            setError('Tên công ty phải có ít nhất 2 ký tự');
            return false;
        }
        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError('Email không hợp lệ');
            return false;
        }
        if (!formData.phone || !/^[0-9]{10,11}$/.test(formData.phone)) {
            setError('Số điện thoại phải có 10-11 chữ số');
            return false;
        }
        if (!formData.description || formData.description.length < 50) {
            setError('Mô tả công ty phải có ít nhất 50 ký tự');
            return false;
        }
        if (!formData.address) {
            setError('Vui lòng nhập địa chỉ công ty');
            return false;
        }
        if (!formData.city) {
            setError('Vui lòng chọn thành phố');
            return false;
        }
        if (!formData.industry) {
            setError('Vui lòng chọn ngành nghề');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setSaving(true);

        try {
            const submitData = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (key === 'socialLinks') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key !== 'logo') {
                    submitData.append(key, formData[key]);
                }
            });

            // Append image file if exists
            if (imageFile) {
                submitData.append('logo', imageFile);
            }

            if (hasCompany && companyId) {
                // Update existing company
                await companyAPI.updateCompany(companyId, submitData);
                setSuccess('Cập nhật hồ sơ công ty thành công!');
            } else {
                // Create new company
                const response = await companyAPI.createCompany(submitData);
                setHasCompany(true);
                setCompanyId(response.data?.company?._id);
                setSuccess('Tạo hồ sơ công ty thành công!');
            }
            
            // Refresh company data
            await fetchCompanyProfile();
        } catch (err) {
            console.error('Save company error:', err);
            setError(err.response?.data?.message || 'Lưu thông tin thất bại. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-1">Quản lý hồ sơ</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Cập nhật thông tin và hình ảnh công ty của bạn</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/employer/dashboard')}
                        disabled={saving}
                        className="hidden sm:flex px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="company-form"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" className="mb-4">{error}</Alert>}
            {success && <Alert type="success" className="mb-4">{success}</Alert>}

            {/* Hero Section Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary-400 to-primary-600 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                    <button
                        type="button"
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all border border-white/20"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Sửa
                    </button>
                </div>

                <div className="px-6 pb-8 relative">
                    <form id="company-form" onSubmit={handleSubmit}>
                        {/* Logo and Basic Info */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start -mt-12 sm:-mt-16 mb-8">
                            <div className="relative group/avatar">
                                <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-md bg-gray-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Company logo"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Building2 className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-2 right-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-white p-1.5 rounded-full shadow-md border border-gray-200 dark:border-slate-600 hover:scale-105 transition-transform opacity-0 group-hover/avatar:opacity-100"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="flex-1 w-full pt-2 sm:pt-16 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tên công ty *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="VD: Công ty TNHH ABC"
                                            className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 font-semibold placeholder:text-gray-400 text-sm sm:text-base"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Website</label>
                                        <div className="flex items-center w-full bg-gray-50 dark:bg-slate-700 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
                                            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            <input
                                                type="text"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                placeholder="company.com"
                                                className="bg-transparent border-none p-0 w-full text-gray-900 dark:text-white focus:ring-0 placeholder:text-gray-400 text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="contact@company.com"
                                            className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0123456789"
                                            className="w-full bg-gray-50 dark:bg-slate-700 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* About Section */}
                            <div className="xl:col-span-2 bg-gray-50 dark:bg-slate-700 rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Giới thiệu công ty</h3>
                                    
                                </div>
                                <div className="flex-1">
                                    <div className="space-y-1.5 mb-4">
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tổng quan (Tagline)</label>
                                        <input
                                            type="text"
                                            name="overview"
                                            value={formData.overview}
                                            onChange={handleChange}
                                            placeholder="Mô tả ngắn gọn về công ty..."
                                            maxLength="500"
                                            className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                        />
                                        <p className="text-xs text-gray-500">{formData.overview.length}/500 ký tự</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">Mô tả chi tiết *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="8"
                                            placeholder="Mô tả chi tiết về công ty, văn hóa, môi trường làm việc..."
                                            className="w-full h-64 bg-white dark:bg-slate-600 border-none rounded-xl p-4 text-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary-500/50 resize-none text-sm leading-relaxed placeholder:text-gray-400"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000 ký tự (tối thiểu 50)</p>
                                    </div>
                                </div>

                                {/* Social Links - Moved under Description */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mạng xã hội</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Facebook</label>
                                            <input
                                                type="text"
                                                name="socialLinks.facebook"
                                                value={formData.socialLinks.facebook}
                                                onChange={handleChange}
                                                placeholder="https://facebook.com/company"
                                                className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">LinkedIn</label>
                                            <input
                                                type="text"
                                                name="socialLinks.linkedin"
                                                value={formData.socialLinks.linkedin}
                                                onChange={handleChange}
                                                placeholder="https://linkedin.com/company"
                                                className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Twitter</label>
                                            <input
                                                type="text"
                                                name="socialLinks.twitter"
                                                value={formData.socialLinks.twitter}
                                                onChange={handleChange}
                                                placeholder="https://twitter.com/company"
                                                className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">YouTube</label>
                                            <input
                                                type="text"
                                                name="socialLinks.youtube"
                                                value={formData.socialLinks.youtube}
                                                onChange={handleChange}
                                                placeholder="https://youtube.com/company"
                                                className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Attributes */}
                            <div className="xl:col-span-1 flex flex-col gap-6">
                                <div className="bg-gray-50 dark:bg-slate-700 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thuộc tính chính</h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Ngành nghề *</label>
                                            <div className="relative">
                                                <select
                                                    name="industry"
                                                    value={formData.industry}
                                                    onChange={handleChange}
                                                    className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="">-- Chọn ngành --</option>
                                                    {industries.map(industry => (
                                                        <option key={industry} value={industry}>{industry}</option>
                                                    ))}
                                                </select>
                                                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Quy mô công ty</label>
                                            <div className="relative">
                                                <select
                                                    name="size"
                                                    value={formData.size}
                                                    onChange={handleChange}
                                                    className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="1-10">1-10 nhân viên</option>
                                                    <option value="11-50">11-50 nhân viên</option>
                                                    <option value="51-200">51-200 nhân viên</option>
                                                    <option value="201-500">201-500 nhân viên</option>
                                                    <option value="501-1000">501-1000 nhân viên</option>
                                                    <option value="1000+">1000+ nhân viên</option>
                                                </select>
                                                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Năm thành lập</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="foundedYear"
                                                    value={formData.foundedYear}
                                                    onChange={handleChange}
                                                    min="1900"
                                                    max={new Date().getFullYear()}
                                                    className="w-full bg-white dark:bg-slate-600 border-none rounded-xl pl-10 pr-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                                />
                                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Additional Info */}
                                <div className="bg-gray-50 dark:bg-slate-700 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Địa chỉ & Liên hệ</h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tỉnh/Thành phố *</label>
                                            <div className="relative">
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="">-- Chọn thành phố --</option>
                                                    {cities.map(city => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Quận/Huyện</label>
                                            <input
                                                type="text"
                                                name="district"
                                                value={formData.district}
                                                onChange={handleChange}
                                                placeholder="VD: Quận 1"
                                                className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Khu vực *</label>
                                            <div className="relative">
                                                <select
                                                    name="region"
                                                    value={formData.region}
                                                    onChange={handleChange}
                                                    className="w-full bg-white dark:bg-slate-600 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="Miền Bắc">Miền Bắc</option>
                                                    <option value="Miền Trung">Miền Trung</option>
                                                    <option value="Miền Nam">Miền Nam</option>
                                                </select>
                                                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Địa chỉ *</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Nhập địa chỉ..."
                                                    className="w-full bg-white dark:bg-slate-600 border-none rounded-xl pl-10 pr-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 text-sm placeholder:text-gray-400"
                                                    required
                                                />
                                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                       
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfilePage;