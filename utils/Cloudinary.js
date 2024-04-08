const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret : process.env.CLOUDINARY_CLOUD_API_SECRET,
});


const Cloudinary_Upload_Image = async(filetoupload)=>{
    try {
        const data = await cloudinary.uploader.upload(filetoupload,{resource_type:"auto"});
        return data;
    } catch (error) {
        return error;
    }
}

const Cloudinary_Remove_Image = async(ImagePublicID)=>{
    try {
        const result = await cloudinary.uploader.destroy(ImagePublicID);
        return result;
    } catch (error) {
        return error;
    }
}

const Cloudinary_Remove_Multible_Image = async(ImagePublicIDs)=>{
    try {
        const result = await cloudinary.v2.api.delete_resources(ImagePublicIDs);
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = {
    Cloudinary_Upload_Image,
    Cloudinary_Remove_Image,
    Cloudinary_Remove_Multible_Image,
}