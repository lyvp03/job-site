import mongoose from "mongoose"; 
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//API apply in 1 job POST /api/applications/:jobId
export const applyJob=async(req,res)=>{
    try{
        //get data
        const {jobId}=req.params;
        const {coverLetter}=req.body;
        const candidateId=req.user._id;//get req.user._id, role from protect middleware
        const userRole=req.user.role;

        //Validate
        if(!mongoose.Types.ObjectId.isValid(jobId)){ //job id valid
            return res.status(400).json({
                success:false,
                message:'Invalid ID job'
            });
        }

        if(userRole!=='candidate'){ // role:candidate
            return res.status(403).json({
                success:false,
                message:'Only candidate can apply'
            });
        }
         
        if(!req.file){
            return res.status(400).json({ //req.file exist
                success:false,
                message:'Please upload file CV'
            });
        }

        const job=await Job.findById(jobId); //jobs exist, active
        if(!job){
            return res.status(404).json({
                success:false,
                message:'Job not exist'
            });
        }

        if(job.deadline && new Date()>job.deadline){
            return res.status(400).json({
                success:false,
                message:'Job expired'
            });
        }
        const existingApplication=await Application.findOne({
            job:jobId,
            candidate:candidateId
        }); //candidate apply this job yet???
        if(existingApplication){
            return res.status(400).json({
                success:false,
                message:"You applied this job already"
            });
        }

        //Create application
        const application=await Application.create({
            job:jobId,
            candidate:candidateId,
            resume:{
                filename:req.file.filename,
                originalName: req.file.originalname, 
                path:req.file.path,
                mimetype:req.file.mimetype,
                size:req.file.size, coverLetter:coverLetter||''
            }
        });

        //populate 
        await application.populate('job', 'title salary location jobType');
        await application.populate('candidate','name email phone');

        //res
        res.status(201).json({
            success:true,
            message:'Job applied successful', 
            data: application
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

//API get my applications GET /api/applications/me
export const getMeApplications=async (req, res)=>{
    try{
        //get data
        const userId=req.user._id;
        const userRole=req.user.role;

        //check role
        if(userRole!=='candidate'){
            return res.status(403).json({
                success:false,
                message:'Only candidate can see this'
            });
        }

        //db query 
        const applications=await Application.find({candidate:userId})
            .sort({createdAt:-1})
            .populate({path: 'job',select: 'title salary location jobType deadline'});

        return res.status(200).json({
            success: true,
            count:applications.length,
            data: applications
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Server error: ${error.message}`
        });
    }
};

//API employer get applications in4  GET /api/jobs/:jobId/applications
export const getJobApplycations=async(req, res)=>{
    try{
        //get data
        const {jobId}=req.params;
        const userId=req.user._id;
        const userRole=req.user.role;

        //validate
        if(userRole!=='employer'){//check role
            return res.status(403).json({
                success:false,
                message:'Only employers can view job applications'
            });
        }

        const job= await Job.findById(jobId);
        if(! job){//check job exist
            return res.status(404).json({
                success:false,
                message:"Job not found"
            });
        }

        if(job.createdBy.toString()!==userId.toString()){//check ownership
            return res.status(403).json({
                success:false,
                message:"You can only view applications of your own jobs"
            });
        }
        //get applications with candidate data
        const applications=await Application.find({job:jobId})
            .sort({createdAt:-1})
            .populate({
                path:'candidate',
                select:'name email phone'
            })
            .populate({
                path:'job',
                select:'title'
            })
        //res
        res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

//API update application status PUT /api/applications/:applicationId/status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;
        const userRole = req.user.role;

        // Validate
        if (userRole !== 'employer') {
            return res.status(403).json({
                success: false,
                message: 'Only employers can update application status'
            });
        }

        // Valid statuses
        const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // Find application and populate job to check ownership
        const application = await Application.findById(applicationId).populate('job');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check if employer owns the job
        if (application.job.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update applications for your own jobs'
            });
        }

        // Update status
        application.status = status;
        await application.save();

        // Populate candidate info for response
        await application.populate('candidate', 'name email');

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: application
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

// API download/view CV GET /api/applications/:applicationId/cv
export const downloadCV = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        // Find application
        const application = await Application.findById(applicationId).populate('job');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check permissions
        const isEmployer = userRole === 'employer' && 
                          application.job.createdBy.toString() === userId.toString();
        const isCandidate = userRole === 'candidate' && 
                           application.candidate.toString() === userId.toString();

        if (!isEmployer && !isCandidate) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this CV'
            });
        }

        // Get CV file path
        const cvPath = application.resume?.path;
        if (!cvPath) {
            return res.status(404).json({
                success: false,
                message: 'CV file not found'
            });
        }

        // Resolve absolute path
        const absolutePath = path.resolve(cvPath);

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({
                success: false,
                message: 'CV file does not exist on server'
            });
        }

        // Set headers for PDF
        res.setHeader('Content-Type', application.resume.mimetype || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${application.resume.originalName}"`);

        // Stream file
        const fileStream = fs.createReadStream(absolutePath);
        fileStream.pipe(res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

