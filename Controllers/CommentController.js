const {Comment,validate_create_comment,validate_update_comment} = require("../Models/Comment");
const asyncHandler = require("express-async-handler");


/**
 * @desc create comment
 * @method POST
 * @router /api/comments
 * @acces private (only logged user)
 */
module.exports.CreateComment = asyncHandler(
    async(req,res)=>{
        const {error} = validate_create_comment(req.body);
        if(error)
        {
            return res.status(400).json({message:error.details[0].message});
        }
        const comment = new Comment({
            user_id : req.user.id,
            body:req.body.body,
            post_id : req.body.post_id,
        })
        await comment.save();
        res.status(200).json({message:"comment create successfully",comment});
    }
)

/**
 * @desc Get All Comment
 * @method GET
 * @router /api/comments
 * @acces private (only admin)
 */
module.exports.GetAllComments = asyncHandler(
    async(req,res)=>{
        const comments = await Comment.find().populate("user_id");
        res.status(200).json({message:"All Comments",comments});
    }
)

/**
 * @desc Get All Comment of one post
 * @method GET
 * @router /api/comments/post/:id
 * @acces private (only logged user)
 */
module.exports.GetAllCommentsPost = asyncHandler(
    async(req,res)=>{
        const comments = await Comment.find({post_id:req.params.id});
        res.status(200).json({message:"All comment of one post",comments});
    }
)

/**
 * @desc Delete Comment
 * @method DELETE
 * @router /api/comments/:id
 * @acces private (only owner user or admin)
 */
module.exports.DeleteComment = asyncHandler(
    async(req,res)=>{
        const comment = await Comment.findById(req.params.id);
        if(!comment)
        {
            return res.status(404).json({message:"this comment not found"});
        }
        if(req.user.is_admin || req.user.id === comment.user_id.toString())
        {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json({message:"comment deleted succesfully"});
        }
        else
        {
            return res.status(403).json({message:"not allowed only admin or owner user"});
        }
        
    }
)

/**
 * @desc Update Comment
 * @method PUT
 * @router /api/comments/:id
 * @acces private (only owner user)
 */
module.exports.UpdateComment = asyncHandler(
    async(req,res)=>{
        const {error} = validate_update_comment(req.body);
        if(error)
        {
            return res.status(400).json({message:error.details[0].message});
        }
        const comment = await Comment.findById(req.params.id);
        if(!comment)
        {
            return res.status(404).json({message:"comment not found"});
        }
        if(req.user.id !== comment.user_id.toString())
        {
            return res.status(403).json({message:"no allowed only owner user"});
        }
        const updated_comment = await Comment.findByIdAndUpdate(req.params.id,{
            $set:{
                body:req.body.body,
            }
        },{new:true})
        res.status(200).json({message:"comment updated successfully",updated_comment});
    }
)

