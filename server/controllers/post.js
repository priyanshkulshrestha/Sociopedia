import User from "../models/User.js";
import {Post} from "../models/Post.js";

// Create
export const createPost = async (req, res) => {
    try{
        const { Id, description, picturePath} = req.body;
        console.log("req.body ",req.body);
        console.log("userId ",Id);
        const user = await User.findById(Id);
        console.log("user ",user);
        console.log("filename ",req.file);
        let pictureName = req.file.filename;
        const newPost = new Post({
            userId: Id,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user?.picturePath,
            picturePath: pictureName,
            likes: {},
            comments: [],
        })
        console.log("newPost ",newPost);
        await newPost.save();

        const post = await Post.find();
        res.status(201).json({
            success:true,
            post});
    }catch(err){
        res.status(409).json({
            success: false,
            message: err.message
        }) 
    }
}

// READ
export const getFeedPosts = async(req, res) => {
    try{
        const post = await Post.find();
        res.status(201).json({
            success:true,
            post});
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message
        }) 
    }
}

export const getUserPosts = async(req, res) => {
    try{
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(201).json({
            success:true,
            post});
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message
        }) 
    }
}

// UPDATE
export const likePost = async(req, res) => {
    try{
        const {id} = req.params;
        const userId = req.body.Id;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}
        )

        res.status(201).json({
            success:true,
            updatedPost});
    }catch(err){
        res.status(404).json({
            success: false,
            message: err.message
        }) 
    }
}