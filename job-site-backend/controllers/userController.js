import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, role } = req.query;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Chỉ admin có quyền xem danh sách người dùng', 403));
    }

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: users
    });
});

// @desc    Get single user (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Chỉ admin có quyền xem thông tin người dùng', 403));
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return next(new ErrorResponse('Không tìm thấy người dùng', 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Disable user account (Admin only)
// @route   PUT /api/users/:id/disable
// @access  Private/Admin
export const disableUser = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Chỉ admin có quyền vô hiệu hoá tài khoản', 403));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return next(new ErrorResponse('Không tìm thấy người dùng', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Vô hiệu hoá tài khoản thành công',
        data: user
    });
});

// @desc    Enable user account (Admin only)
// @route   PUT /api/users/:id/enable
// @access  Private/Admin
export const enableUser = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Chỉ admin có quyền kích hoạt tài khoản', 403));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: true },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return next(new ErrorResponse('Không tìm thấy người dùng', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Kích hoạt tài khoản thành công',
        data: user
    });
});

// @desc    Delete user account (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Chỉ admin có quyền xoá tài khoản', 403));
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new ErrorResponse('Không tìm thấy người dùng', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Xoá tài khoản thành công',
        data: {}
    });
});

// @desc    Save a job
// @route   POST /api/users/save-job/:jobId
// @access  Private/Candidate
export const saveJob = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if job already saved
    const user = await User.findById(userId);
    if (user.savedJobs.includes(jobId)) {
        return next(new ErrorResponse('Công việc này đã được lưu', 400));
    }

    // Add job to savedJobs
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { savedJobs: jobId } },
        { new: true }
    ).populate('savedJobs');

    res.status(200).json({
        success: true,
        message: 'Đã lưu công việc',
        data: updatedUser
    });
});

// @desc    Unsave a job
// @route   DELETE /api/users/save-job/:jobId
// @access  Private/Candidate
export const unsaveJob = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Remove job from savedJobs
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedJobs: jobId } },
        { new: true }
    ).populate('savedJobs');

    res.status(200).json({
        success: true,
        message: 'Đã bỏ lưu công việc',
        data: updatedUser
    });
});

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private/Candidate
export const getSavedJobs = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
        path: 'savedJobs',
        options: {
            limit: limit * 1,
            skip: (page - 1) * limit,
            sort: '-createdAt'
        }
    });

    if (!user) {
        return next(new ErrorResponse('Không tìm thấy người dùng', 404));
    }

    const total = user.savedJobs.length;

    res.status(200).json({
        success: true,
        count: user.savedJobs.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: user.savedJobs
    });
});
