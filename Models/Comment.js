const mongoose = require("mongoose");
const joi = require("joi");

const CommentSchema = new mongoose.Schema({
    post_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required : true,
    },
    user_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    body:{
        type:String,
        required:true,
    },

},{timestamps:true,});

const Comment = mongoose.model("Comment",CommentSchema);

const validate_create_comment=(obj)=>{
    const schema = joi.object({
        post_id : joi.string().required(),
        body: joi.string().trim().required(),
    })
    return schema.validate(obj);
}

const validate_update_comment=(obj)=>{
    const schema = joi.object({
        body: joi.string().trim().required(),
    })
    return schema.validate(obj);
}

module.exports ={
    Comment,
    validate_create_comment,
    validate_update_comment
}