import multer from 'multer';
import path from 'path';

// Storage config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Tự động chọn thư mục dựa trên fieldname
        let folder = 'uploads/';
        
        if (file.fieldname === 'logo') {
            folder += 'logos/';
        } else if (file.fieldname === 'cv' || file.fieldname === 'resume') {
            folder += 'resumes/';
        } else if (file.fieldname === 'avatar') {
            folder += 'avatars/';
        } else {
            folder += 'general/';
        }
        
        cb(null, folder);
    },
    filename: function(req, file, cb) {
        // Tạo tên file unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedName = file.originalname
            .replace(/\s+/g, '-')
            .replace(/[^\w.-]/g, '');
        
        cb(null, sanitizedName + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter file config - Mở rộng để hỗ trợ nhiều loại file
const fileFilter = (req, file, cb) => {
    // Accept PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    // Accept images (for logos, avatars)
    else if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    // Accept Word documents
    else if (
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        cb(null, true);
    }
    else {
        cb(new Error('Chỉ chấp nhận file PDF, hình ảnh, hoặc Word documents'), false);
    }
};

// Middleware upload
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Export các middleware 
export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);