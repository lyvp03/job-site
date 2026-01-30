import mongoose from 'mongoose';
import {industries} from '../utils/industries.js';
import {cities} from '../utils/cities.js';

//create job schema
const JobSchema=new mongoose.Schema({
    title:{
        type: String, 
        required:[true, 'Vui lòng nhập tiêu đề tin'],
        minlength:[10, 'Tiêu đề có độ dài từ 10-200 ký tự'], 
        maxlength:[200,'Tiêu đề có độ dài từ 10-200 ký tự' ],
    },
    companyName: {
        type: String,
        required: [true, 'Vui lòng nhập tên công ty'],
        minlength: [2, 'Tên công ty từ 2-100 ký tự'],
        maxlength: [100, 'Tên công ty từ 2-100 ký tự'],
    },
    description:{
        type:String,
        required:[true, 'Vui lòng nhập mô tả công việc'],
        minlength:[100, 'Mô tả công việc có độ dài từ 100-2000 ký tự'],
        maxlength:[2000, 'Mô tả công việc có độ dài từ 100-2000 ký tự'],
    },
    requirements:{
        type:String,
        required:[true, 'Vui lòng nhập yêu cầu công việc'],
        minlength:[50, 'Yêu cầu công việc có độ dài từ 50-1000 ký tự'],
        maxlength:[1000, 'Yêu cầu công việc có độ dài từ 50-1000 ký tự'],
    },
    industry:{
        type: String,
        required:[true, 'Vui lòng chọn ngành nghề'], 
        enum: industries,
    },
    location:{
        address:{
            type:String, 
            required:[true, 'Vui lòng nhập địa chỉ cụ thể'],
        },
        city:{
            type:String,
            required:[true, 'Vui lòng chọn tỉnh/thành phố'], 
            enum: cities,
        },
        region:{
            type: String,
            required:[true, 'Vui lòng chọn khu vực'],
            enum:["Miền Bắc", "Miền Trung", "Miền Nam"]
        },
        //Dùng khi cần lọc theo khoảng cách, map
        coordinates:{
            lat:{type:Number},
            lng:{type:Number},
        },
    },
    salary: {
        min: { 
            type: Number, required: true 
        },
        max: { 
            type: Number, required: true 
        },
        currency: { 
            type: String, 
            enum: ["VND", "USD"], default: "VND" 
        }
    },
    jobType:{
        type:String, 
        required:[true, 'Vui lòng chọn hình thức làm việc'],
        enum:["full-time", "part-time", "remote"],
    },
    experience:{
        type:String, 
        required:[true, 'Vui lòng chọn yêu cầu kinh nghiệm'],
        enum:["Không yêu cầu", "Dưới 1 năm", "Từ 1-2 năm", "Từ 3-5 năm", "Trên 5 năm"],
    },
    deadline:{
        type:Date,
        required:true,
        validate:{
            validator:function(value){
                return value>Date.now();
            }, 
            message:"Hạn nộp phải lớn hơn ngày hiện tại",
        },
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Company",
    },
    views:{
        type:Number,
        default:0,
        min:0
    },
    status: {
        type: String,
        enum: ["active", "expired", "closed"],
        default: "active",
    },
  },
  {timestamps:true}
);

const Job=mongoose.model('Job', JobSchema);
export default Job;
