import express from 'express';
import {
    getCompanies,
    getMyCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyJobs,
    searchCompanies,
    uploadCompanyLogo,
    verifyCompany
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import {upload} from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protected routes (định nghĩa trước để tránh conflict với /:id)
router.get('/my-companies', protect, getMyCompanies);

// Public routes
router.get('/', getCompanies);
router.get('/search', searchCompanies);
router.get('/:id', getCompany);
router.get('/:id/jobs', getCompanyJobs);

// Protected routes (POST, PUT, DELETE)
router.post('/', protect, upload.single('logo'), createCompany);
router.put('/:id', protect, upload.single('logo'), updateCompany);
router.delete('/:id', protect, deleteCompany);
router.post('/:id/logo', protect, upload.single('logo'), uploadCompanyLogo);
router.patch('/:id/verify', protect, verifyCompany);

export default router;