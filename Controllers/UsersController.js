const async_handler = require("express-async-handler");
const {User} = require("../Models/User");
const {validate_update} = require("../Models/User");
const bcryptjs = require("bcryptjs")
const path = require("path");
const fs = require("fs");
const {Cloudinary_Remove_Image,Cloudinary_Upload_Image, Cloudinary_Remove_Multible_Image}=require("../utils/Cloudinary");
const { Post } = require("../Models/Post");
const {Comment} = require("../Models/Comment");


/**
 * @desc Get All Users
 * @router /api/users
 * @method GET
 * @access private (only admin)
 */
module.exports.GetAllUsers = async_handler(
    async(req,res)=>{
        const users = await User.find().select("-password");
        res.status(200).json({message:"All users",users});
    }
)

/**
 * @desc get one user
 * @router /api/users/:id
 * @method GET
 * @access private (only admin)
 */
module.exports.GetOneUser = async_handler(
    async(req,res)=>{
        const user = await User.findById(req.params.id).select("-password");
        res.status(200).json({message:"user found",user});
    }
)

/**
 * @desc update user
 * @method PUT
 * @router /api/users/:id
 * @access private (only user)
 */
module.exports.UpdateUser = async_handler(
    async(req,res)=>{
        const {error} = validate_update(req.body);
        if(error)
        {
            return res.status(400).json({message:error.details[0].message});
        }
        if(req.body.password)
        {
            salt = await bcryptjs.genSalt(10);
            req.body.password = await bcryptjs.hash(req.body.password,salt);
        }
        const user = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                user_name:req.body.user_name,
                password:req.body.password,
                bio:req.body.bio,
            }
        },{new:true}).select("-password");
        res.status(200).json(user);
    }
)

/**
 * @desc get users count
 * @method GET
 * @router /api/users/count
 * @access private (only admin)
 */
module.exports.GetUsersCount = async_handler(
    async(req,res)=>{
        const users_count = await User.count();
        res.status(200).json({message:`users count is : ${users_count}`});
    }
)

/**
 * @desc upload image
 * @method POST
 * @router /api/users/upload-image
 * @access private (only loged user)
 */
module.exports.UploadImage=async(req,res)=>{
    if(!req.file)
    {
        return res.status(400).json({message:"no image provieded"});
    }
    image_path = path.join(__dirname,`../images/${req.file.filename}`); 
    const result = await Cloudinary_Upload_Image(image_path);
    //console.log(result);
    const user = await User.findById(req.user.id);
    if(user.profile_photo.public_id !== null)
    {
        await Cloudinary_Remove_Image(user.profile_photo.public_id);
    }
    user.profile_photo = {
        url : result.secure_url,
        public_id : result.public_id,
    }
    await user.save();
    res.status(200).json({message:"your image uploaded successfully",profile_photo:{url:result.secure_url,public_id:result.public_id}});
    fs.unlinkSync(image_path);
}

/**
 * @desc delete user
 * @method DELETE
 * @router /api/users/:id
 * @access private (admin or user himself)
 */
module.exports.DeleteUser = async_handler(
    async(req,res)=>{
        const user = await User.findById(req.params.id);
        if(!user)
        {
            return res.status(404).json({message:"user not found"});
        }
        //get all posts and image public_ids of this user
        const comments = await Comment.find({user_id:user._id});
        const posts = await Post.find({user:user._id});
        const public_ids= posts?.map((post)=>post.image.public_id);
        if(public_ids?.length > 0)
        {
            await Cloudinary_Remove_Multible_Image(public_ids);
        }
        //delete all posts and comments of this user
        if(posts?.length>0)
        {
            await Post.deleteMany({user:user._id});
        }
        if(comments?.length>0)
        {
            await Comment.deleteMany({user_id:user._id});
        }
        //remove image of user from cloudinary.
        if(user.profile_photo.public_id)
        {
            await Cloudinary_Remove_Image(user.profile_photo.public_id);
        }
        await User.findByIdAndDelete(req.params.id); 
        res.status(200).json({message:"user has been deleted successfully"});
    }
)

/**
 * @desc get posts of the user
 * @method GET
 * @router /api/posts/user/:id
 * @access public
 */
module.exports.GetPostsOfUser = async_handler(
    async(req,res)=>{
        const user = await User.findById(req.params.id).populate("posts");
        if(!user)
        {
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"user and own posts",user});
    }
)