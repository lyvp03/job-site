import React, { useState } from 'react';
import { X, Mail, Check, Save, Upload } from 'lucide-react';
import FormField from './FormField';

const ApplyJobModal = ({ isOpen, onClose, jobTitle, onSubmit, isSubmitting }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [errors, setErrors] = useState({});

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên của bạn';
        }
        
        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email của bạn';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        
        if (!resume) {
            newErrors.resume = 'Vui lòng tải lên CV của bạn';
        } else {
            if (resume.size > 5 * 1024 * 1024) {
                newErrors.resume = 'File CV không được vượt quá 5MB';
            }
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(resume.type)) {
                newErrors.resume = 'Chỉ chấp nhận file PDF hoặc Word';
            }
        }
        
        if (coverLetter && coverLetter.length > 500) {
            newErrors.coverLetter = 'Thư xin việc không được vượt quá 500 ký tự';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResume(file);
            setErrors(prev => ({ ...prev, resume: '' }));
        }
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit({ fullName, email, resume, coverLetter });
        }
    };

    // Handle close
    const handleClose = () => {
        if (!isSubmitting) {
            setFullName('');
            setEmail('');
            setResume(null);
            setCoverLetter('');
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div aria-labelledby="modal-title" aria-modal="true" className="relative z-[9999]" role="dialog">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            ></div>
            
            <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto flex items-center justify-center p-4 sm:p-0">
                {/* Modal Panel */}
                <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#2a1e32] text-left shadow-2xl transition-all w-full max-w-lg border border-gray-200 dark:border-white/5">
                    {/* Decorative Top Border/Gradient */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ad2bee] to-transparent opacity-50"></div>
                    
                    {/* Close Button */}
                    <div className="absolute right-6 top-6 z-10">
                        <button 
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="rounded-lg p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-white focus:outline-none transition-colors disabled:opacity-50"
                            type="button"
                        >
                            <span className="sr-only">Đóng</span>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="px-6 pt-6 pb-4">
                        {/* Header Content */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white tracking-tight mb-1" id="modal-title">
                                Ứng tuyển vị trí
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {jobTitle}
                            </p>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Field 1: Full Name */}
                            <FormField
                                label="Họ và tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                error={errors.fullName}
                                disabled={isSubmitting}
                                placeholder="e.g. Nguyễn Văn A"
                                required={true}
                            />

                            {/* Field 2: Email */}
                            <FormField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                                disabled={isSubmitting}
                                placeholder="alex@example.com"
                                icon={Mail}
                                helperText="Chúng tôi sẽ không chia sẻ email của bạn với bất kỳ ai."
                                required={true}
                            />

                            {/* Field 3: Resume Upload */}
                            <div className="p-4 rounded-lg bg-white dark:bg-[#1c1022]/50 border border-gray-200 dark:border-white/5">
                                <label className="flex flex-col gap-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">CV/Resume *</span>
                                        <span className="text-xs text-gray-400 dark:text-[#b09db9]">PDF hoặc Word</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Upload className="w-5 h-5 text-gray-400 dark:text-[#b09db9]" />
                                        </div>
                                        <input 
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            disabled={isSubmitting}
                                            className="w-full h-14 pl-12 pr-4 rounded-lg bg-gray-50 dark:bg-[#1c1022]/50 border border-gray-300 dark:border-[#4b3b54] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#b09db9]/50 font-medium focus:outline-none focus:border-[#E2ADF2] focus:ring-4 focus:ring-[#E2ADF2]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        />
                                    </div>
                                </label>
                                {resume && (
                                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">✓ Đã chọn: {resume.name} ({(resume.size / 1024).toFixed(2)} KB)</p>
                                )}
                                {errors.resume && (
                                    <p className="mt-2 text-xs text-red-500 font-medium">{errors.resume}</p>
                                )}
                            </div>

                            {/* Field 4: Cover Letter */}
                            <div className="p-4 rounded-lg bg-white dark:bg-[#1c1022]/50 border border-gray-200 dark:border-white/5">
                                <label className="flex flex-col gap-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Thư xin việc</span>
                                        <span className="text-xs text-gray-400 dark:text-[#b09db9]">Tối đa 500 ký tự</span>
                                    </div>
                                    <textarea 
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        disabled={isSubmitting}
                                        maxLength={500}
                                        placeholder="Giới thiệu bản thân, kinh nghiệm và lý do bạn phù hợp với vị trí này..."
                                        className="w-full min-h-[100px] p-3 rounded-lg bg-gray-50 dark:bg-[#1c1022]/50 border border-gray-300 dark:border-[#4b3b54] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#b09db9]/50 font-medium focus:outline-none focus:border-[#E2ADF2] focus:ring-4 focus:ring-[#E2ADF2]/20 transition-all duration-200 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </label>
                                <div className="flex justify-end mt-2">
                                    <p className={`text-xs font-medium ${coverLetter.length > 400 ? 'text-red-500' : 'text-gray-400 dark:text-[#b09db9]'}`}>
                                        {coverLetter.length}/500
                                    </p>
                                </div>
                                {errors.coverLetter && (
                                    <p className="mt-2 text-xs text-red-500 font-medium">{errors.coverLetter}</p>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 dark:bg-[#1c1022]/30 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-2 border-t border-gray-200 dark:border-white/5">
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            type="button"
                            className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-[#9d1dd4] to-[#ad2bee] px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-[#ad2bee]/40 hover:shadow-lg hover:shadow-[#ad2bee]/50 hover:from-[#8d0dc0] hover:to-[#9d1dd4] sm:w-auto transition-all focus:outline-none focus:ring-2 focus:ring-[#ad2bee] focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] uppercase tracking-wide"
                        >
                            <Check className="w-4 h-4" />
                            Ứng tuyển
                        </button>
                        <button 
                            onClick={handleClose}
                            disabled={isSubmitting}
                            type="button"
                            className="mt-2 inline-flex w-full justify-center items-center gap-2 rounded-lg bg-white dark:bg-[#2a1e32] border border-gray-300 dark:border-[#4b3b54] px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a2e42] sm:mt-0 sm:w-auto transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyJobModal;