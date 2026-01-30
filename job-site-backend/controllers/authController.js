import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

//generate token from user id
const generateToken=(id)=>{

    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'30d',});
};

//API Register
export const registerUser=async(req, res)=>{
    try{
        const {name, email, password, role}=req.body;

        //Check data missing
        if(!name||!email||!password){
            return res.status(400).json({message:'Please fill all fields'});
        }

        //Check exist user
        const userExists= await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:'Email already exists'});
        }
        
        //Create new user
        const user= await User.create({name, email, password, role});

        //return user+token
        res.status(201).json({
            message:'User registed successfully',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email, 
                role:user.role
            },
            token: generateToken(user._id),
        });
    } catch(error){
        res.status(500).json({message: `Server error: ${error.message}`});
    }
};

//API Login
export const loginUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not exist.' });
        }

        // call the instance method on the user to compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password not correct' });
        }

        return res.status(200).json({
            message: 'User login successfully.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

//API get user data by token
export const getMe=async(req,res)=>{
    res.status(200).json({
    user: req.user // đã được middleware lấy ra
    });
        
};

