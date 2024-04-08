const mongoose = require("mongoose");
const joi = require("joi");


const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:200,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:10,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        default:{
            url:"",
            public_id:null,
        }
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        }
    ]
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}});

PostSchema.virtual("comments",{
    ref:"Comment",
    foreignField:"post_id",
    localField:"_id",
})
const Post = mongoose.model("Post",PostSchema);

const Validate_Create_Post = (obj)=>{
    const schema = joi.object({
        title : joi.string().trim().min(2).max(200).required(),
        description : joi.string().trim().min(10).required(),
        category : joi.string().trim().required(),
    });
    return schema.validate(obj);
}

const Validate_Update_Post = (obj)=>{
    const schema = joi.object({
        title : joi.string().trim().min(2).max(200),
        description : joi.string().trim().min(10),
        category : joi.string().trim(),
    })
    return schema.validate(obj);
}
module.exports = {
    Post,
    Validate_Create_Post,
    Validate_Update_Post,
}