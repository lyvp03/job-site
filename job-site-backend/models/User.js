import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//Khai báo schema (cấu trúc dữ liệu) người dùng
const UserSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Vui lòng nhập họ tên'],
    },
    email:{
        type: String,
        required: [true, "Vui lòng nhập email"],
        unique: true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Email không hợp lệ",
        ],
    },
    password:{
        type:String,
        required:[true, "Vui lòng nhập mật khẩu"],
        minlength:[6, "Mật khẩu có ít nhất 6 ký tự"],
        match:[/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "Mật khẩu phải có ít nhất 1 chữ và 1 số"],
    },
    role:{
        type:String,
        enum:["candidate", "employer","admin"],
        default:"candidate",
    },
    isActive:{
        type: Boolean,
        default: true
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
},
{timestamps:true}
);

//Mã hoá mật khẩu trước khi được lưu
//chay truoc khi save vao db
UserSchema.pre("save", async function (next){
    if(!this.isModified('password')) return next();

    //tao salt de ma hoa
    const salt=await bcrypt.genSalt(10);

    //ma hoa mat khau
    this.password=await bcrypt.hash(this.password, salt);
    next();   
});

//So sanh mat khau
UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;