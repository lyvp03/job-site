import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../api/jobAPI';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { industries } from '../../utils/industries';
import { cities } from '../../utils/cities';

const CreateJobPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        requirements: '',
        industry: '',
        location: {
            address: '',
            city: '',
            region: 'Miền Bắc'
        },
        salary: {
            min: '',
            max: '',
            currency: 'VND'
        },
        jobType: 'full-time',
        experience: 'Không yêu cầu',
        deadline: ''
    });

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

    const validateForm = () => {
        if (!formData.title || formData.title.length < 10) {
            setError('Tiêu đề phải có ít nhất 10 ký tự');
            return false;
        }
        if (!formData.companyName || formData.companyName.length < 2) {
            setError('Tên công ty phải có ít nhất 2 ký tự');
            return false;
        }
        if (!formData.description || formData.description.length < 100) {
            setError('Mô tả công việc phải có ít nhất 100 ký tự');
            return false;
        }
        if (!formData.requirements || formData.requirements.length < 50) {
            setError('Yêu cầu công việc phải có ít nhất 50 ký tự');
            return false;
        }
        if (!formData.industry) {
            setError('Vui lòng chọn ngành nghề');
            return false;
        }
        if (!formData.location.city) {
            setError('Vui lòng chọn thành phố');
            return false;
        }
        if (!formData.salary.min || !formData.salary.max) {
            setError('Vui lòng nhập khoảng lương');
            return false;
        }
        if (parseInt(formData.salary.min) >= parseInt(formData.salary.max)) {
            setError('Lương tối đa phải lớn hơn lương tối thiểu');
            return false;
        }
        if (!formData.deadline) {
            setError('Vui lòng chọn hạn nộp hồ sơ');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Convert salary to numbers
            const jobData = {
                ...formData,
                salary: {
                    min: parseInt(formData.salary.min),
                    max: parseInt(formData.salary.max),
                    currency: formData.salary.currency
                }
            };

            const response = await jobAPI.createJob(jobData);
            
            setSuccess('Đăng tin tuyển dụng thành công!');
            
            setTimeout(() => {
                navigate('/employer/jobs/manage');
            }, 1500);

        } catch (err) {
            console.error('Create job error:', err);
            setError(err.response?.data?.message || 'Đăng tin thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Get min date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Đăng tin tuyển dụng mới</h1>
                <p className="text-gray-600 mt-2">Điền đầy đủ thông tin để đăng tin tuyển dụng</p>
            </div>

            <Card>
                <Card.Body>
                    {error && <Alert type="error" className="mb-4">{error}</Alert>}
                    {success && <Alert type="success" className="mb-4">{success}</Alert>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Thông tin cơ bản
                            </h2>
                            
                            <Input
                                label="Tiêu đề tin tuyển dụng *"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="VD: Tuyển Developer Full-stack"
                                required
                                helperText={`${formData.title.length}/200 ký tự`}
                            />

                            <Input
                                label="Tên công ty *"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="VD: Công ty TNHH ABC"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngành nghề *
                                </label>
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    required
                                >
                                    <option value="">-- Chọn ngành nghề --</option>
                                    {industries.map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Mô tả công việc
                            </h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả chi tiết *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.description.length}/2000 ký tự (tối thiểu 100)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Yêu cầu công việc *
                                </label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Yêu cầu về kỹ năng, kinh nghiệm..."
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.requirements.length}/1000 ký tự (tối thiểu 50)
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Địa điểm làm việc
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tỉnh/Thành phố *
                                    </label>
                                    <select
                                        name="location.city"
                                        value={formData.location.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        required
                                    >
                                        <option value="">-- Chọn thành phố --</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Khu vực *
                                    </label>
                                    <select
                                        name="location.region"
                                        value={formData.location.region}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        required
                                    >
                                        <option value="Miền Bắc">Miền Bắc</option>
                                        <option value="Miền Trung">Miền Trung</option>
                                        <option value="Miền Nam">Miền Nam</option>
                                    </select>
                                </div>
                            </div>

                            <Input
                                label="Địa chỉ cụ thể *"
                                name="location.address"
                                value={formData.location.address}
                                onChange={handleChange}
                                placeholder="VD: Số 123 Đường ABC, Quận XYZ"
                                required
                            />
                        </div>

                        {/* Job Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Chi tiết công việc
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hình thức *
                                    </label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        required
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="remote">Remote</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kinh nghiệm *
                                    </label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        required
                                    >
                                        <option value="Không yêu cầu">Không yêu cầu</option>
                                        <option value="Dưới 1 năm">Dưới 1 năm</option>
                                        <option value="Từ 1-2 năm">Từ 1-2 năm</option>
                                        <option value="Từ 3-5 năm">Từ 3-5 năm</option>
                                        <option value="Trên 5 năm">Trên 5 năm</option>
                                    </select>
                                </div>

                                <Input
                                    label="Hạn nộp hồ sơ *"
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    min={today}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Lương tối thiểu (VND) *"
                                    name="salary.min"
                                    type="number"
                                    value={formData.salary.min}
                                    onChange={handleChange}
                                    placeholder="VD: 10000000"
                                    required
                                />
                                <Input
                                    label="Lương tối đa (VND) *"
                                    name="salary.max"
                                    type="number"
                                    value={formData.salary.max}
                                    onChange={handleChange}
                                    placeholder="VD: 20000000"
                                    required
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/employer/jobs/manage')}
                                disabled={loading}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Đang đăng tin...' : 'Đăng tin tuyển dụng'}
                            </Button>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreateJobPage;