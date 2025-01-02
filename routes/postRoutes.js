const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth } = require('../middleware/auth');

router.post('/posts', auth, postController.createPost);

module.exports = router;
