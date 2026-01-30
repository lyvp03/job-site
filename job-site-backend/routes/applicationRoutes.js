import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {upload} from "../middleware/uploadMiddleware.js";
import {
    applyJob, 
    getMeApplications, 
    getJobApplycations,
    updateApplicationStatus, 
    downloadCV 
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/:jobId", protect, upload.single('resume'), applyJob);
router.get("/me", protect, getMeApplications);
router.get("/:jobId/applications", protect, getJobApplycations);
router.put("/:applicationId/status", protect, updateApplicationStatus);
router.get("/:applicationId/cv", protect, downloadCV);

export default router;