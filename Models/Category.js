const mongoose = require("mongoose");
const joi = require("joi");


const CategorySchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
    title:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true});

const Category = mongoose.model("Category",CategorySchema);

const validate_create_category = (obj)=>{
    const schema = joi.object({
        title : joi.string().trim().required().label("title")
    })
    return schema.validate(obj);
}

module.exports = {
    Category,
    validate_create_category,
}
