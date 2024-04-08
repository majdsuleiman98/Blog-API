const express = require("express");
const connecttoDB=require("./config/ConnectToDB");
const { NotFound,errorHandler } = require("./middlewares/error");
require("dotenv").config();

//connect to DataBase
connecttoDB();

//run express
const app = express();

//middleware to make express framework handle with json files(request)
app.use(express.json());

//Routes
app.use("/api/auth",require("./Routes/AuthRoute"));
app.use("/api/users",require("./Routes/UsersRoute"));
app.use("/api/posts",require("./Routes/PostRoute"));
app.use("/api/comments",require("./Routes/CommentRoute"));
app.use("/api/categories",require("./Routes/CategoryRoute"));


//handler error
app.use(NotFound);
app.use(errorHandler);

//run server
PORT=process.env.PORT || 8000
const server = app.listen(PORT,()=>{
    console.log(`server is running in ${process.env.MONGO_ENV} mode on ${PORT} port`);
})

