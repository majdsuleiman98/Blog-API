const router = require("express").Router();
const {Verify_Token_Admin_or_UserHimself,Verify_Token,Verify_Token_Admin,Verify_Update_User_Himself} = require("../middlewares/VerifyToken");
const {CreatePost, GetAllPosts, GetOnePost, GetCountPosts, DeleteOnePost, UpdatePost,UpdatePostImage,LikePost} = require("../Controllers/PostController"); 
const Upload_Image= require("../middlewares/PhotoUpload");
const VerifyObjectID = require("../middlewares/VerifyObjectID");


router.get("/count",GetCountPosts);
router.post("",Verify_Token,Upload_Image.single("image"),CreatePost);
router.get("",GetAllPosts);
router.get("/:id",VerifyObjectID,GetOnePost);
router.delete("/:id",VerifyObjectID,Verify_Token,DeleteOnePost);
router.put("/:id",VerifyObjectID,Verify_Token,UpdatePost);
router.put("/update-image/:id",VerifyObjectID,Verify_Token,Upload_Image.single("image"),UpdatePostImage);
router.put("/like/:id",VerifyObjectID,Verify_Token,LikePost);
module.exports = router;