const mongoose = require("mongoose");


module.exports = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connecting with DB");
    } catch (error) {
        console.log("somethings went error",error);
    }
}