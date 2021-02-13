const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const feedController = require("../controller/feed");

const { fileFilter, fileStorage } = require("../helper/upload");

const router = express.Router();

router.get("/posts", feedController.getPost);

router.post(
  "/posts",
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
  [body("title").trim().isLength({ min: 8 }), body("content").trim().isLength({ min: 5 })],
  feedController.createPost
);

router.get("/posts/:postId", feedController.getSinglePost);

module.exports = router;
