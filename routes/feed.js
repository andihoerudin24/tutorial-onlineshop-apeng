const express = require('express');

const feedController = require('../controller/feed')

const router = express.Router()

router.get('/posts',feedController.getPost)
router.post('/posts',feedController.createPost)

module.exports = router