import mongoose from "mongoose";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import {cities} from"../utils/cities.js";
import { expandSearchKeyword, buildSynonymQuery } from "../utils/synonyms.js";




//API Create Job
export const createJob=async(req, res)=>{
    try{
        //1. get data from client
        const {title,companyName, description, requirements, industry, location,salary, jobType, experience, deadline}=req.body;

        //2. validate, handle
        //Check missing data
        if(!title ||! description||!requirements||!industry||!location||!salary||!jobType||!experience||!deadline){
        return res.status(400).json({message:'Please fill all fields'});
        }

        //check user role: employer
        if(req.user.role!=="employer"){
            return res.status(403).json({message:"You don't have permission to create job" });
        }

        // Find company owned by this user
        const company = await Company.findOne({ owner: req.user._id });

        //Save in db
        const job=await Job.create({
            companyName,
            title,
            description, requirements, industry, 
            location,
            salary, 
            jobType, 
            experience, 
            deadline,
            createdBy: req.user._id,
            company: company?._id
        });

        //return res
        res.status(201).json({
            success: true,
            message:'Job created successfully',
            data: job
        });
    }catch(error){
        res.status(500).json({message:`Server error:: ${error.message}`});
    }
};

//API Get jobs created by user
export const getMyJobs=async(req, res)=>{
    try{
        //get req.user._id, role from protect middleware
        const userId=req.user._id;
        const role=req.user.role;
        if(role!=='employer'){
            return res.status(403).json({message:"You don't have permission."});
        }
        const jobs=await Job.find({createdBy: req.user._id})
            .sort({createdAt:-1});
        res.status(200).json({
            success:true,
            count: jobs.length,
            jobs: jobs
        });
    }catch (error){
        res.status(500).json({message:`Server error:: ${error.message}`});
    }
};

//API Update Job PUT/api/jobs/:id
export const updateJob=async(req, res)=>{
    try{
        const jobId=req.params.id;
        const userId=req.user._id;
        const userRole=req.user.role;

        //find job by id
        let job=await Job.findById(jobId);

        //check job exist
        if(!job){
            return res.status(404).json({
                success:false,
                message:"Can't find job."
            });
        };

        //check permission - only owner or admin can update
        if(job.createdBy.toString() !== userId.toString() && userRole !== 'admin'){
            return res.status(403).json({
                success:false,
                message:"You don't have permission to edit this job."
            });
        };

        //update job
        const updatedJob=await Job.findByIdAndUpdate(
            jobId,
            req.body,
            {new: true, runValidators: true}
        );

        res.status(200).json({
            success:true,
            data:updatedJob,
            message:'Job updated successfully.'
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message:`Server error:: ${error.message}`
        });
    }
};

//API delete job
export const deleteJob=async(req, res)=>{
    try{
        const jobId=req.params.id;
        const userId=req.user._id;
        const userRole=req.user.role;

        //find job by id
        let job=await Job.findById(jobId);

        //check job exist
        if(!job){
            return res.status(404).json({
                success:false,
                message:"Can't find job."
            });
        }

        //check permission - only owner or admin can delete
        if(job.createdBy.toString() !== userId.toString() && userRole !== 'admin'){
            return res.status(403).json({
                success:false,
                message:"You don't have permission to delete this job."
            });
        }

        //delete
        await Job.findByIdAndDelete(jobId);

        res.status(200).json({
            success:true,
            message:'Job deleted successfully.',
            deletedJobId:jobId
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message:`Server error:: ${error.message}`
        });
    }
};

//API get jobs public
export const getPublicJobs=async(req,res)=>{
    try{
    //1. get and handle data from req.query
        const {
        keyword,
        industry,
        region, 
        city,
        jobType,
        experience,
        minSalary,
        maxSalary,
        sort,
        page, 
        limit,
        }=req.query;

        //pagination
        const pageNum=Number(page) ||1;
        const limitNum=Number(limit) ||10;
        const skip=(pageNum-1)*limitNum;

        //Handle Salary
        const minSal=minSalary?Number(minSalary):null;
        const maxSal=maxSalary?Number(maxSalary):null;

        //decode keyword
        const searchKeyword=keyword?.trim()||null;

        //Handle city
        let cityFilter=null;
        let matchedCity=null;
        if(city){
            //delete white space, to lower case
            const normalizeCity=city.trim().toLowerCase();
            matchedCity = cities.find((c) => c.toLowerCase() === normalizeCity);
        }
        if(matchedCity){
            cityFilter=matchedCity;
        }else{
            console.log(`City invalid`);
        }
        
    //2. build query obj
        let queryObject={};

        //filter industry
        if(industry){
            queryObject.industry=industry;
        }
        //filter city
        if(cityFilter){
            queryObject["location.city"]=cityFilter;
        }
        //filter jobtype
        if(jobType){
            queryObject.jobType=jobType;
        }
        //filter experience
        if(experience){
            // support comma-separated list from frontend (e.g. "Dưới 1 năm,Từ 1-2 năm")
            if (typeof experience === 'string' && experience.includes(',')) {
                const parts = experience.split(',').map(s => s.trim()).filter(Boolean);
                if (parts.length > 0) {
                    queryObject.experience = { $in: parts };
                }
            } else {
                queryObject.experience = experience;
            }
        }
        if(region){
            queryObject["location.region"]=region;
        }
        //filter salary - check overlap between job salary range and selected range
        if(minSal || maxSal){
            // Job overlaps with selected range if:
            // job.salary.max >= minSalary_selected AND job.salary.min <= maxSalary_selected
            const salaryConditions = [];
            if (minSal) salaryConditions.push({ "salary.max": { $gte: minSal } });
            if (maxSal) salaryConditions.push({ "salary.min": { $lte: maxSal } });
            
            if (salaryConditions.length > 0) {
                queryObject.$and = (queryObject.$and || []).concat(salaryConditions);
            }
        }
        //search by kw in title and description
        if (searchKeyword) {
            // Mở rộng keyword thành các từ đồng nghĩa
            const synonyms = expandSearchKeyword(searchKeyword);
            
            console.log(`Search keyword: "${searchKeyword}" expanded to:`, synonyms);
            
            // Build query với tất cả synonyms
            queryObject.$or = buildSynonymQuery(synonyms);
        }
        //get not expire
        queryObject.deadline = { $gt: new Date() };
        console.log("Final queryObject:", queryObject);

        
    //Sort, pagination, query db
        //sort
        let sortOption={};

        if(sort){
            //'-'Desc not asc
            if(sort.startsWith("-")){
                sortOption[sort.substring(1)]=-1;
            }else{
                sortOption[sort]=1;
            }
        }else{
            //default: sort by newest job
            sortOption={createdAt:-1};
        }
        console.log("Sort option:", sortOption);
        //query mongoDb
        const jobs=await Job.find(queryObject)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .populate({
                path:"createdBy", 
                select:"name email"
            })
            .populate({
                path: "company",
                select: "name logo description overview industry city region email phone website"
            })
            .lean(); //return plain JS obj, slighter
        //count job
        const totalJobs = await Job.countDocuments(queryObject);
        const totalPages = Math.ceil(totalJobs / limitNum);
        //res
        res.status(200).json({
            success: true,
            totalJobs,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
            jobs,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message:`Server error:: ${error.message}`
        });
    }
};

//API get 1 job details GET /api/jobs/:id
export const getJobById=async(req,res)=>{
    try{
        //get data
        //get id and validate
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid job id"});
        };
        //query db
        const job=await Job.findById(id)
            .populate({
                path: "createdBy", 
                select:"name  email "
            })
            .populate({
                path: "company",
                select: "name logo description overview industry city region email phone website"
            });
        if(!job){
            return res.status(404).json({message:"Job not found."});
        }
        // Only check deadline for public access (not for employer viewing their own job)
        if(job.deadline<new Date() && req.user && job.createdBy.toString() !== req.user._id.toString()){
            return res.status(404).json({message:"Job expired."});
        }
        //view increase - use updateOne to bypass validation
        await Job.updateOne(
            { _id: id },
            { $inc: { views: 1 } }
        );
        job.views=(job.views||0)+1;
        //res
        res.status(200).json({
            success: true,
            data: job
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message:`Server error:: ${error.message}`
        });
    }
};

