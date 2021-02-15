const { validationResult } = require("express-validator");
const Post = require("../model/post");
const fs = require("fs");
const path = require("path");
const User = require("../model/user");
const io = require('../socket');

exports.getPost = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "Fetched Post Successfuly",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("validation failed,entered data is incorect");
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error("No Image provided");
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const posts = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });
    await posts.save();
    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(posts);
    await user.save();
   
    io.getIO().emit('posts',{
      action:'create',
      post:posts
    })

    res.status(200).json({
      message: "post created successfuly",
      post: posts,
      creator: {
        _id: creator._id,
        name: creator.name,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Post Fetched",
      post: post,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("validation failed,entered data is incorect");
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      const error = new Error("No Image provided");
      error.statusCode = 422;
      throw error;
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let ImageUrl = req.body.image;
    if (req.file) {
      ImageUrl = req.file.path;
    }
    if (!ImageUrl) {
      const error = new Error("no file picked");
      error.statusCode = 422;
      throw error;
    }
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("not authorized");
      error.statusCode = 404;
      throw error;
    }
    if (ImageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = ImageUrl;
    post.content = content;
    const result = await post.save();
    res.status(200).json({
      message: "Post Updated",
      post: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("not authorized");
      error.statusCode = 404;
      throw error;
    }
    //check login user
    clearImage(post.imageUrl);
    const result = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    const results = await user.save();
    res.status(200).json({
      message: "deleted post",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const clearImage = (filepath) => {
  filepath = path.join(__dirname, "..", filepath);
  fs.unlink(filepath, (err) => console.log(err));
};
