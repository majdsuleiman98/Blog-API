const multer = require("multer");
const path = require("path");


const PhotoStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../images"));
    },
    filename:(req,file,cb)=>{
        if(file)
        {
            cb(null,new Date().toISOString().replace(/:/g,"-") + file.originalname);
        }
        else
        {
            cb(null,false);
        }
    }
})

const Upload_Image = multer({
    storage:PhotoStorage,
    fileFilter:function(req,file,cb)
    {
        if(file.mimetype.startsWith("image"))
        {
            cb(null,true);
        }
        else
        {
            cb({message:"unsupported file type"},false);
        }
    },
    limits:{fileSize : 1024*1024}
});

module.exports=Upload_Image