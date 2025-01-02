const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth } = require('../middleware/auth');

router.post('/posts', auth, postController.createPost);
router.get('/posts/:topicId', postController.getPostsByTopic);

module.exports = router;
