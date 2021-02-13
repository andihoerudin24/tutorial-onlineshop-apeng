const { validationResult } = require("express-validator");
const Post = require("../model/post");
const multer = require('multer');

exports.getPost = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Fetched Post Successfuly",
        posts: posts,
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
