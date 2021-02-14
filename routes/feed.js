const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const feedController = require("../controller/feed");
const isAuth = require('../middleware/is-auth');
const { fileFilter, fileStorage } = require("../helper/upload");

const router = express.Router();

router.get("/posts",isAuth,feedController.getPost);

router.post(
  "/posts",isAuth,
   multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
  [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })],
  feedController.createPost
);

router.get("/posts/:postId",isAuth,feedController.getSinglePost);

router.put("/posts/:postId",isAuth,multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),[body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })],feedController.updatePost);

router.delete('/posts/:postId',isAuth,feedController.deletePost)

module.exports = router;
