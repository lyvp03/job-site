import express from 'express';
import {
    getAllUsers,
    getUserById,
    disableUser,
    enableUser,
    deleteUser,
    saveJob,
    unsaveJob,
    getSavedJobs
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect tất cả routes
router.use(protect);

// Debug route - kiểm tra user hiện tại
router.get('/debug/me', (req, res) => {
    res.json({
        user: req.user,
        role: req.user?.role,
        isAdmin: req.user?.role === 'admin'
    });
});

// Candidate routes
router.get('/saved-jobs', getSavedJobs);
router.post('/save-job/:jobId', saveJob);
router.delete('/save-job/:jobId', unsaveJob);

// Admin routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/disable', disableUser);
router.put('/:id/enable', enableUser);
router.delete('/:id', deleteUser);

export default router;
