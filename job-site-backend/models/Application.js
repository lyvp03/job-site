import mongoose from "mongoose";

//create application schema
const ApplicationSchema=new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:[true, "Job ID là bắt buộc"],
    },
    candidate:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, "Candidate ID là bắt buộc"]
    },
    status:{
        type:String, 
        enum:['pending', 'reviewing', 'accepted', 'rejected'],
        default:'pending'
    },
    coverLetter:{
        type:String,
        maxlength:[2000,'Thư xin việc không dài quá 2000 ký tự']
    },
    resume:{
        filename:{type:String, required:true},
        originalName:{type:String, required:true},
        path:{type:String, required:true},
        size:{type:Number, required:true},
        mimetype:{type:String, default:'application/pdf'
        }
    },
},
    {timestamps:true}
);

//avoid apply many times
ApplicationSchema.index({job:1, candidate:1}, {unique:true});

const Application =mongoose.model('Application', ApplicationSchema);

export default Application;