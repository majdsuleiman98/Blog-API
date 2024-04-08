const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const complex_password = require("joi-password-complexity");


const UserSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:100,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        minlength:5,
        maxlength:100,
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:8,
    },
    profile_photo:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            public_id:null,
        }
    },
    bio:{
        type:String,
    },
    is_admin:{
        type:Boolean,
        default:false,
    },
    is_account_verified:{
        type:Boolean,
        default:false,
    }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}});

//get all posts of user
UserSchema.virtual("posts",{
    ref:"Post",
    foreignField:"user",
    localField:"_id",
})


//generate user token
UserSchema.methods.GenerateAuthToken=function(){
    return jwt.sign({id:this._id,is_admin:this.is_admin},process.env.JWT_SECRET);
}

//create User modle
const User = mongoose.model("User",UserSchema);

//validation Register new user
const Validate_Register = (obj)=>{
    const schema = joi.object({
        user_name : joi.string().trim().min(2).max(100).required(),
        email : joi.string().trim().min(5).max(100).required().email(),
        password : complex_password().required(),
    })
    return schema.validate(obj);
}

//validation login user
const Validate_Login = (obj)=>{
    const schema = joi.object({
        email : joi.string().trim().min(5).max(100).required().email(),
        password : joi.string().trim().min(8).required(),
    })
    return schema.validate(obj);
}

//validate update user
const validate_update = (obj)=>{
    const schema = joi.object({
        user_name : joi.string().trim().min(2).max(100),
        password : complex_password(),
        bio : joi.string(),
    })
    return schema.validate(obj);
}

//export user model and validation functions
module.exports={
    User,
    Validate_Register,
    Validate_Login,
    validate_update
}