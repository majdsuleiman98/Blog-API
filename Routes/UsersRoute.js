const router = require("express").Router();
const {GetAllUsers,GetOneUser,UpdateUser, GetUsersCount,UploadImage,DeleteUser,GetPostsOfUser} = require("../Controllers/UsersController")
const {Verify_Token_Admin_or_UserHimself,Verify_Token,Verify_Token_Admin,Verify_Update_User_Himself} = require("../middlewares/VerifyToken");
const VerifyObjectID = require("../middlewares/VerifyObjectID");
const Upload_Image= require("../middlewares/PhotoUpload");


router.get("/count",Verify_Token_Admin,GetUsersCount);
router.get("",Verify_Token_Admin,GetAllUsers);
router.get("/:id",VerifyObjectID,Verify_Token_Admin,GetOneUser);
router.put("/:id",VerifyObjectID,Verify_Update_User_Himself,UpdateUser);
router.post("/upload-image",Verify_Token,Upload_Image.single("image"),UploadImage);
router.delete("/:id",VerifyObjectID,Verify_Token_Admin_or_UserHimself,DeleteUser);
router.get("/posts/user/:id",VerifyObjectID,Verify_Token,GetPostsOfUser);


module.exports=router;