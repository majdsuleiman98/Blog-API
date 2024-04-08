const async_handler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const {User,Validate_Register,Validate_Login} = require("../Models/User");


/**-------------------------
 * @desc Register New User
 * @router api/auth/register
 * @method POST
 * @access public
 *--------------------------*/

module.exports.Register = async_handler(
    async(req,res)=>{
        const {error} = Validate_Register(req.body);
        if(error)
        {
            return res.status(400).json({message : error.details[0].message});
        }
        let user = await User.findOne({email:req.body.email});
        if(user)
        {
            return res.status(400).json({message:"user already exist"});
        }
        const salt = await bcryptjs.genSalt(10);
        const hashed_password = await bcryptjs.hash(req.body.password,salt);
        user = new User({
            user_name : req.body.user_name,
            email : req.body.email,
            password : hashed_password,
        })
        await user.save();
        res.status(201).json({message:"you reigistered successfully",user});
})


/**------------------------
 * @desc login user
 * @router api/auth/login
 * @method POST
 * @access public
 *--------------------------*/
module.exports.Login = async_handler(
    async(req,res)=>{
        const {error} = Validate_Login(req.body);
        if(error)
        {
            return res.status(400).json({message:error.details[0].message});
        }
        const user = await User.findOne({email:req.body.email});
        if(!user)
        {
            return res.status(400).json({message:"invalid email or password"});
        }
        const is_password_match = await bcryptjs.compare(req.body.password,user.password);
        if(!is_password_match)
        {
            return res.status(400).json({message:"invalid password"});
        }
        const token = user.GenerateAuthToken();
        res.status(200).json({message:"you are login",user,token});
    }
)