import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    // Basic Info
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên công ty'],
        trim: true,
        minlength: [2, 'Tên công ty phải có ít nhất 2 ký tự'],
        maxlength: [200, 'Tên công ty không vượt quá 200 ký tự']
    },
    
    // Contact Info
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email công ty'],
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại'],
        match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    },
    website: {
        type: String,
        match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Website không hợp lệ']
    },
    
    // Location
    address: {
        type: String,
        required: [true, 'Vui lòng nhập địa chỉ']
    },
    city: {
        type: String,
        required: [true, 'Vui lòng chọn thành phố']
    },
    district: {
        type: String
    },
    region: {
        type: String,
        enum: ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
        required: true
    },
    
    // Description
    description: {
        type: String,
        required: [true, 'Vui lòng nhập mô tả công ty'],
        minlength: [50, 'Mô tả phải có ít nhất 50 ký tự'],
        maxlength: [2000, 'Mô tả không vượt quá 2000 ký tự']
    },
    overview: {
        type: String,
        maxlength: [500, 'Tổng quan không vượt quá 500 ký tự']
    },
    
    // Logo & Images
    logo: {
        type: String,
        default: '/images/default-company-logo.png'
    },
    coverImage: {
        type: String,
        default: '/images/default-company-cover.jpg'
    },
    images: [{
        type: String
    }],
    
    // Company Details
    industry: {
        type: String,
        required: [true, 'Vui lòng chọn ngành nghề']
    },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
        default: '1-10'
    },
    foundedYear: {
        type: Number,
        min: [1900, 'Năm thành lập không hợp lệ'],
        max: [new Date().getFullYear(), 'Năm thành lập không hợp lệ']
    },
    
    // Social Media
    socialLinks: {
        facebook: String,
        linkedin: String,
        twitter: String,
        youtube: String
    },
    
    // Status
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // References
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Stats
    totalJobs: {
        type: Number,
        default: 0
    },
    totalViews: {
        type: Number,
        default: 0
    },
    
    // Metadata
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    keywords: [{
        type: String
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for jobs
CompanySchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'createdBy',
    justOne: false
});

// Pre-save middleware to generate slug
CompanySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-')
            + '-' + Date.now().toString().slice(-6);
    }
    next();
});

// Indexes for better performance
CompanySchema.index({ name: 'text', description: 'text', industry: 'text' });
CompanySchema.index({ city: 1, region: 1 });
CompanySchema.index({ isVerified: 1, isActive: 1 });
CompanySchema.index({ createdBy: 1 });

const Company = mongoose.model('Company', CompanySchema);
export default Company;