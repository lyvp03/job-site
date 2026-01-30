import Company from '../models/Company.js';
import Job from '../models/Job.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, city, region, industry, size } = req.query;
    
    const query = {};
    if (city) query.city = city;
    if (region) query.region = region;
    if (industry) query.industry = industry;
    if (size) query.size = size;
    
    const companies = await Company.find(query)
        .select('name logo industry city size foundedYear totalJobs isVerified')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort('-createdAt');
    
    const total = await Company.countDocuments(query);
    
    res.status(200).json({
        success: true,
        count: companies.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: companies
    });
});

// @desc    Get my companies (for current employer)
// @route   GET /api/companies/my-companies
// @access  Private/Employer
export const getMyCompanies = asyncHandler(async (req, res, next) => {
    // Only employers can access their own companies
    if (req.user.role !== 'employer') {
        return next(new ErrorResponse(`Không có quyền truy cập`, 403));
    }

    const companies = await Company.find({ owner: req.user.id })
        .populate('createdBy', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: companies.length,
        companies
    });
});

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
export const getCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id)
        .populate('createdBy', 'name email avatar')
        .populate('owner', 'name email');
    
    if (!company) {
        return next(new ErrorResponse(`Không tìm thấy công ty với ID ${req.params.id}`, 404));
    }
    
    // Increment view count
    company.totalViews += 1;
    await company.save();
    
    res.status(200).json({
        success: true,
        data: company
    });
});

// @desc    Create company
// @route   POST /api/companies
// @access  Private/Employer
export const createCompany = asyncHandler(async (req, res, next) => {
    // Check if user already has a company
    const existingCompany = await Company.findOne({ owner: req.user.id });
    if (existingCompany) {
        return next(new ErrorResponse(`Tài khoản của bạn đã có một hồ sơ công ty. Vui lòng cập nhật hồ sơ hiện tại thay vì tạo mới.`, 400));
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;
    req.body.owner = req.user.id;
    
    // Convert foundedYear to number (FormData sends as string)
    if (req.body.foundedYear && req.body.foundedYear !== '') {
        const year = parseInt(req.body.foundedYear, 10);
        if (!isNaN(year)) {
            req.body.foundedYear = year;
        }
    }
    
    // Parse socialLinks if it's a JSON string (FormData sends as string)
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
        try {
            req.body.socialLinks = JSON.parse(req.body.socialLinks);
        } catch (err) {
            req.body.socialLinks = {};
        }
    }
    
    // Handle logo file if uploaded
    if (req.file) {
        req.body.logo = `/uploads/companies/${req.file.filename}`;
    } else {
        // Remove logo from body if no file uploaded (let default be used)
        delete req.body.logo;
    }
    
    // Set owner to current user
    req.body.owner = req.user.id;
    
    try {
        const company = await Company.create(req.body);
        
        res.status(201).json({
            success: true,
            company: company
        });
    } catch (error) {
        console.error('Create company error:', error);
        return next(new ErrorResponse(error.message || 'Lỗi khi tạo hồ sơ công ty', 400));
    }
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Employer
export const updateCompany = asyncHandler(async (req, res, next) => {
    let company = await Company.findById(req.params.id);
    
    if (!company) {
        return next(new ErrorResponse(`Không tìm thấy công ty với ID ${req.params.id}`, 404));
    }
    
    // Check ownership
    if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Không có quyền cập nhật công ty này`, 403));
    }
    
    // Convert foundedYear to number (FormData sends as string)
    if (req.body.foundedYear && req.body.foundedYear !== '') {
        const year = parseInt(req.body.foundedYear, 10);
        if (!isNaN(year)) {
            req.body.foundedYear = year;
        }
    }
    
    // Parse socialLinks if it's a JSON string (FormData sends as string)
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
        try {
            req.body.socialLinks = JSON.parse(req.body.socialLinks);
        } catch (err) {
            req.body.socialLinks = {};
        }
    }
    
    // Handle logo file if uploaded
    if (req.file) {
        req.body.logo = `/uploads/companies/${req.file.filename}`;
    } else if (req.body.logo === '') {
        // Remove logo from body if empty (don't override existing logo)
        delete req.body.logo;
    }
    
    try {
        company = await Company.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            company: company
        });
    } catch (error) {
        console.error('Update company error:', error);
        return next(new ErrorResponse(error.message || 'Lỗi khi cập nhật hồ sơ công ty', 400));
    }
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Employer/Admin
export const deleteCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
        return next(new ErrorResponse(`Không tìm thấy công ty với ID ${req.params.id}`, 404));
    }
    
    // Check ownership - only owner or admin can delete
    if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Không có quyền xóa công ty này`, 403));
    }
    
    // Delete all jobs belonging to this company
    await Job.deleteMany({ createdBy: company.createdBy });
    
    // Delete the company
    await company.deleteOne();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get company jobs
// @route   GET /api/companies/:id/jobs
// @access  Public
export const getCompanyJobs = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
        return next(new ErrorResponse(`Không tìm thấy công ty với ID ${req.params.id}`, 404));
    }
    
    const jobs = await Job.find({ createdBy: company.createdBy })
        .select('title salary location jobType experience deadline status createdAt')
        .sort('-createdAt');
    
    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });
});

// @desc    Search companies
// @route   GET /api/companies/search
// @access  Public
export const searchCompanies = asyncHandler(async (req, res, next) => {
    const { q, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (q) {
        query = {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { industry: { $regex: q, $options: 'i' } }
            ]
        };
    }
    
    const companies = await Company.find(query)
        .select('name logo industry city size totalJobs isVerified')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort('-totalJobs');
    
    const total = await Company.countDocuments(query);
    
    res.status(200).json({
        success: true,
        count: companies.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: companies
    });
});

// @desc    Upload company logo
// @route   POST /api/companies/:id/logo
// @access  Private/Employer
export const uploadCompanyLogo = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
        return next(new ErrorResponse(`Không tìm thấy công ty với ID ${req.params.id}`, 404));
    }
    
    // Check ownership
    if (company.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Không có quyền cập nhật logo`, 403));
    }
    
    if (!req.file) {
        return next(new ErrorResponse(`Vui lòng chọn file ảnh`, 400));
    }
    
    company.logo = `/uploads/companies/${req.file.filename}`;
    await company.save();
    
    res.status(200).json({
        success: true,
        data: company
    });
});

// @desc    Verify company
// @route   PATCH /api/companies/:id/verify
// @access  Private/Admin
export const verifyCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
        return next(new ErrorResponse(`Không tìm thấy công ty với ID ${req.params.id}`, 404));
    }
    
    company.isVerified = !company.isVerified;
    await company.save();
    
    res.status(200).json({
        success: true,
        data: company
    });
});