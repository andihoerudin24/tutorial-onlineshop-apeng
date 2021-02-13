const { validationResult } = require("express-validator");
const Post = require("../model/post");
const fs = require("fs");
const path = require("path");
exports.getPost = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find().skip((currentPage - 1) * perPage).limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Fetched Post Successfuly",
        posts: posts,
        totalItems:totalItems
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
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
  const posts = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: "Andi Hoerudin",
    },
  });
  posts
    .save()
    .then((result) => {
      res.status(200).json({
        message: "post created successfuly",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post Fetched",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
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
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      if (ImageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = ImageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post Updated",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      //check login user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "deleted post",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filepath) => {
  filepath = path.join(__dirname, "..", filepath);
  fs.unlink(filepath, (err) => console.log(err));
};
