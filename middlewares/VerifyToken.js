const jwt = require("jsonwebtoken");


const Verify_Token=(req,res,next)=>{
    const authToken = req.headers.authorization;
    if(authToken)
    {
        const token = authToken.split(" ")[1];
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;//req.user contain id and is_admin
            next();
        } catch (error) {
            return res.status(401).json({message:"invalid token"});
        }
    }
    else
    {
        return res.status(401).json({message:"no provieded token , access denied"})
    }
}

const Verify_Token_Admin = (req,res,next)=>{
    Verify_Token(req,res,()=>{
        if(req.user.is_admin)
        {
            next();
        }
        else
        {
            return res.status(403).json({message:"no allowed , you are not admin!!!"});
        }
    })
}

const Verify_Update_User_Himself = (req,res,next)=>{
    Verify_Token(req,res,()=>{
        if(req.user.id === req.params.id)
        {
            next();
        }
        else
        {
            return res.status(403).json({message:"not allowed , only user himself"});
        }
    })
}

const Verify_Token_Admin_or_UserHimself = (req,res,next)=>{
    Verify_Token(req,res,()=>{
        if(req.user.id === req.params.id || req.user.is_admin)
        {
            next();
        }
        else
        {
            return res.status(403).json({message:"not allowed , only admin or user himself"});
        }
    })
}

module.exports={Verify_Token,Verify_Token_Admin,Verify_Update_User_Himself,Verify_Token_Admin_or_UserHimself};