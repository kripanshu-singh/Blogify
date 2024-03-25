import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/uploadCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

//! CREATE POST
const createPost = asyncHandler(async (req, res) => {
    //! Fetching all the inputs
    // console.log(`\n ~ createPost ~ req.body :- `, req.body);
    const { title, body, category } = req.body;

    const thumbnailLocalPath = req.file?.path;
    // console.log(`\n ~ createPost ~ req.file?.path :- `, req.file.path);

    const user = req.user;
    console.log(body.length < 12);
    //! check if we get all the input
    if (!title || body.length < 12 || !category || !thumbnailLocalPath)
        throw new ApiError(401, "All fiels must be filled");

    //! make sure title is unique
    const matchTitle = await Post.findOne({ title });
    if (matchTitle) throw new ApiError(400, "This Title is allready used");

    //! uploading thumbnail to cloudinary
    const thumbnailOnCloudinary = await uploadOnCloudinary(thumbnailLocalPath);
    //! creating Post
    const createdPost = await Post.create({
        title,
        body,
        thumbnail: thumbnailOnCloudinary.url,
        category,
        thumbnailPublicID: thumbnailOnCloudinary.public_id,
        creator: user._id,
    });

    //! after creating post increment no of post of user
    const postNumber = user.posts + 1;
    await User.findByIdAndUpdate(user._id, { posts: postNumber });
    return res
        .status(200)
        .json(new ApiResponce(201, createdPost, "Post created successfully"));
});

//! GET ALL POSTS
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ updatedAt: -1 });

    //! what if post is empty (No post is there)
    if (!posts) throw new ApiError(400, "No post found");

    //! if posts are there then send them
    return res
        .status(200)
        .json(new ApiResponce(200, posts, "Here is all posts "));
});

//! GET SINGLE POST DETAILS BY ID
const getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(`\n ~ getSinglePost ~ _id :- `, id);

    //! match id with DB
    const post = await Post.findById(id);

    //! if post not found
    if (!post) throw new ApiError(400, "Invalid Id ");

    return res.status(200).json(new ApiResponce(200, post, "success"));
});

//! GET ALL POST OF CATEGORY
const getPostByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const postsOfCategory = await Post.find({ category }).sort({});
    // console.log(
    // `\n ~ getPostByCategory ~ postsOfCategory :- `,
    // postsOfCategory
    // );

    // if (!postsOfCategory.length)
    //     throw new ApiError(400, "No post for this category yet");

    return res
        .status(200)
        .json(new ApiResponce(200, postsOfCategory, "Success"));
});

//! GET ALL POST BY USER
const getPostByUser = asyncHandler(async (req, res) => {
    console.log("first");
    const { id } = req.params;

    const postsOfUser = await Post.find({ creator: id }).sort({});
    // console.log(`\n ~ getPostByUser ~ postsOfUser :- `, postsOfUser);

    // if (!postsOfUser.length)
    // res.status(200).json(
    //     new ApiResponce(200, postsOfUser, "No post by this author yet")
    // );

    return res.status(200).json(new ApiResponce(200, postsOfUser, "Success"));
});

//! EDIT POST
const editPost = asyncHandler(async (req, res) => {
    const { title, body, category } = req.body;

    const { id } = req.params;

    const user = req.user;

    const newThumbnailPath = req.file?.path;
    // console.log(`\n ~ editPost ~ req.file :- `, req.file);

    const post = await Post.findById(id);

    if (!post.creator.equals(user._id)) {
        //! make sure post creator id matches to user id
        throw new ApiError(403, "Only the post owner can edit the post");
    }
    if (!newThumbnailPath) throw new ApiError(400, "Choose new thumbnail");
    //! check wheater we get all the fields
    if (!title || body.length < 12 || !category || !newThumbnailPath)
        throw new ApiError(400, "All fields must be filled");

    //! Make sure that title is unique
    // const uniqueTitle = await Post.findOne({ title });
    // if (!(uniqueTitle === title) && uniqueTitle)
    //     throw new ApiError(400, "This title is all ready in use");

    //! Upload thumbnail in cloudinary
    const newThumbnailOnCloudinary = await uploadOnCloudinary(newThumbnailPath);

    //! embed all the new post details
    const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
            title,
            body,
            category,
            thumbnail: newThumbnailOnCloudinary.url,
            thumbnailPublicID: newThumbnailOnCloudinary.public_id,
        },
        { new: true }
    );
    // console.log(`\n ~ editPost ~ updatedPost :- `, updatedPost);

    //! Delete thumbnail from cloudinary
    const oldPublicId = post.thumbnailPublicID;
    await deleteFromCloudinary(oldPublicId);

    return res
        .status(200)
        .json(new ApiResponce(200, updatedPost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const post = await Post.findById({ _id: id });

    //! if no post with that id
    if (!post) throw new ApiError(400, "No post with that id");

    //! make sure only user and creator is same
    if (!post.creator.equals(user.id))
        throw new ApiError(403, "Only the post owner can delete the post");

    //! save thumbnail publicId before deleting
    const oldPublicId = post.thumbnailPublicID;

    //! delete the post
    const deletePost = await Post.deleteOne({ _id: id });

    //! delete the thumnail from cloudinary
    await deleteFromCloudinary(oldPublicId);

    if (!deletePost) throw new ApiError(500, "Error while deleting post");

    return res
        .status(200)
        .json(new ApiResponce(200, deletePost, "Post deleted successfully"));
});

export {
    createPost,
    getAllPosts,
    getSinglePost,
    getPostByCategory,
    getPostByUser,
    editPost,
    deletePost,
};
