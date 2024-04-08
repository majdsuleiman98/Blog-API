const {Category,validate_create_category} = require("../Models/Category");
const asyncHandler = require("express-async-handler");


/**
 * @desc create new category
 * @method POST
 * @router /api/categories
 * @access private (only admin)
 */
module.exports.CreateCategory = asyncHandler(
    async(req,res)=>{
        const {error} = validate_create_category(req.body);
        if(error)
        {
            return res.status(400).json({message : error.details[0].message});
        }
        const new_category = await Category.create({
            title : req.body.title,
            user : req.user.id,
        });
        res.status(201).json({message:"category created successfully",new_category});
    }
)

/**
 * @desc get all categories
 * @method GET
 * @router /api/categories
 * @access public
 */
module.exports.GetAllCategories = asyncHandler(
    async(req,res)=>{
        const categories = await Category.find();
        res.status(200).json({message:"all categories",categories});
    }
)

/**
 * @desc delete  category
 * @method DELETE
 * @router /api/categories/:id
 * @access public
 */
module.exports.DeleteCategory = asyncHandler(
    async(req,res)=>{
        const category = await Category.findById(req.params.id);
        if(!category)
        {
            return rs.status(404).json({message:"category is not found"});
        }
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"category deleted successfully"});
    }
)