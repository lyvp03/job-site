import express from "express";
import {createJob, getMyJobs, updateJob, deleteJob, getPublicJobs, getJobById} from '../controllers/jobController.js';
import {protect} from "../middleware//authMiddleware.js"

const router = express.Router();

// Protected routes (GET /my-jobs - định nghĩa trước để tránh conflict)
router.get("/my-jobs", protect, getMyJobs);

// POST, PUT, DELETE
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

// Public routes (GET)
router.get("/", getPublicJobs);
router.get("/:id", getJobById);



export default router;
