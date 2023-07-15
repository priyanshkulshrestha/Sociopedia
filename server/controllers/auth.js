import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register User
export const register = async(req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            // picturePath,
            friends,
            location,
            occupation,
        } = await req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("filename ",req.file);
        let pictureName = req.file.filename;
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: pictureName,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            savedUser
            });

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

// LOGIN FUNCTION
export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({msg: "user not exist"})
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({msg: "Invalid Credentials"})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        delete user.password;
        res.status(200).json({success:true,
            token, user
        })
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}