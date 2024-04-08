const router = require("express").Router()
const {Verify_Token_Admin} = require("../middlewares/VerifyToken");
const {CreateCategory,GetAllCategories, DeleteCategory} = require("../Controllers/CategoryController");
const VerifyObjectID= require("../middlewares/VerifyObjectID")
router.post("",Verify_Token_Admin,CreateCategory);
router.post("",GetAllCategories);
router.delete("/:id",VerifyObjectID,Verify_Token_Admin,DeleteCategory);

module.exports = router