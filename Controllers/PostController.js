const { Post, Validate_Create_Post, Validate_Update_Post } = require("../Models/Post");
const async_handler = require("express-async-handler")
const path = require("path")
const { Cloudinary_Remove_Image, Cloudinary_Upload_Image } = require("../utils/Cloudinary");
const fs = require("fs");
const {Comment} = require("../Models/Comment");

/**
 * @desc create new post
 * @router /api/posts
 * @method POST
 * @access private (only logged user)
 */
module.exports.CreatePost = async_handler(
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "no image provided" });
        }
        const { error } = await Validate_Create_Post(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const image_path = path.join(__dirname, `../images/${req.file.filename}`);
        const result = await Cloudinary_Upload_Image(image_path);
        const post = await Post.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            user: req.user.id,
            image: {
                url: result.secure_url,
                public_id: result.public_id
            }
        })
        res.status(201).json({ message: "post created successfully", post });
        fs.unlinkSync(image_path);
    }
)


/**
 * @desc get all posts
 * @method GET
 * @router /api/posts
 * @access public
 */
module.exports.GetAllPosts = async_handler(
    async (req, res) => {
        const { category, page_number } = req.query;
        const post_per_page = 3;
        let posts;
        if (category) {
            posts = await Post.find({ category: category }).sort({ createdAt: -1 }).populat("user", ["-password"]).populat("comments");
        }
        else if (page_number) {
            posts = await Post.find().skip((page_number - 1) * post_per_page).limit(post_per_page).sort({ createdAt: -1 }).populate("user", ["-password"]).populate("comments");
        }
        else {
            posts = await Post.find().sort({ createdAt: -1 }).populate("user", ["-password"]).populate("comments");
        }
        res.status(200).json({ message: "list of users", posts });
    }
)

/**
 * @desc get One Post
 * @method GET
 * @router /api/post/:id
 * @access public
 */
module.exports.GetOnePost = async_handler(
    async (req, res) => {
        const post = await Post.findById(req.params.id).populate("user", ["-password"]).populate("comments");
        if (!post) {
            return res.status(404).json({ message: "post you search is not found" });
        }
        res.status(200).json({ message: "you search post is found", post });
    }
)

/**
 * @desc get Post count
 * @method GET
 * @router /api/posts/count
 * @access public
 */
module.exports.GetCountPosts = async_handler(
    async (req, res) => {
        const posts_count = await Post.count();
        res.status(200).json({ message: `all posts count is ${posts_count}` });
    }
)

/**
 * @desc delete one Post
 * @method DELETE
 * @router /api/posts/:id
 * @access private (only admin or owner user)
 */
module.exports.DeleteOnePost = async_handler(
    async (req, res) => {
        const post = await Post.findById(req.params.id);
        if (post) {
            if (req.user.is_admin || post.user.toString() === req.user.id) {
                await Post.findByIdAndDelete(req.params.id);
                await Cloudinary_Remove_Image(post.image.public_id);
                await Comment.deleteMany({post_id : post._id});
                res.status(200).json({ message: "post deleted successfully" });
            }
            else {
                return res.status(403).json({ message: "no allowed , you must be admin or owner of post" });
            }
        }
        else {
            return res.status(404).json({ message: "post not found" });
        }
    }
)

/**
 * @desc Update Post
 * @method PUT
 * @router /api/posts/:id
 * @access private (only owner user of the post)
 */
module.exports.UpdatePost = async_handler(
    async (req, res) => {
        const { error } = Validate_Update_Post(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "post is not found" });
        }
        if (req.user.id !== post.user.toString()) {
            return res.status(403).json({ message: "not allowed , only owner user" });
        }
        const updated_post = await Post.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
            }
        }, { new: true }).populate("user", ["-password"]);
        res.status(200).json({ message: "post updated succesfully", updated_post });
    }
)

/**
 * @desc Update Image Post
 * @method PUT
 * @router /api/posts/update-image/:id
 * @access private (only owner user of the post)
 */
module.exports.UpdatePostImage = async_handler(
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "no provided image" });
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }
        if (req.user.id !== post.user.toString()) {
            return res.status(403).json({ message: "no allowed , you must be owner of this post" });
        }
        await Cloudinary_Remove_Image(post.image.public_id);
        const image_path = path.join(__dirname, `../images/${req.file.filename}`);
        const result = await Cloudinary_Upload_Image(image_path);
        const UpdatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: {
                image: {
                    url: result.secure_url,
                    public_id: result.public_id,
                }
            }
        }, { new: true });
        res.status(200).json({ message: "post updated successfully", UpdatedPost });
        fs.unlinkSync(image_path);
    }
)

/**
 * @desc like post 
 * @method PUT
 * @router /api/posts/like/:id
 * @access private (logged user)
 */
module.exports.LikePost = async_handler(
    async (req, res) => {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const isAlreadyLiked = post.likes && post.likes.find((user_id) => user_id.toString() === req.user.id);
        if (isAlreadyLiked) 
        {
            post = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: {
                        likes: req.user.id,
                    },
                },
                { new: true }
            );
        } 
        else 
        {
            post = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        likes: req.user.id,
                    },
                },
                { new: true }
            );
        }
        res.status(200).json(post);
    }
)
