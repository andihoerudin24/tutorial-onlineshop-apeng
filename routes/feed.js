const express = require('express');
const {body} = require('express-validator') 

const feedController = require('../controller/feed')

const router = express.Router()

router.get('/posts',feedController.getPost)

router.post('/posts',[
    body('title').trim().isLength({min:8}),
    body('content').trim().isLength({min:5}),
],feedController.createPost)

router.get('/posts/:postId',feedController.getSinglePost);

module.exports = router