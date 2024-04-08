const router = require("express").Router();
const {Verify_Token,Verify_Token_Admin} = require("../middlewares/VerifyToken")
const {CreateComment,GetAllComments,GetAllCommentsPost, DeleteComment,UpdateComment} = require("../Controllers/CommentController");
const VerifyObjectID = require("../middlewares/VerifyObjectID");

router.post("",Verify_Token,CreateComment);
router.get("",Verify_Token_Admin,GetAllComments);
router.get("/post/:id",VerifyObjectID,Verify_Token,GetAllCommentsPost);
router.delete("/:id",VerifyObjectID,Verify_Token,DeleteComment);
router.put("/:id",VerifyObjectID,Verify_Token,UpdateComment);



module.exports = router;