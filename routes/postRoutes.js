const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth } = require('../middleware/auth');

router.post('/posts', auth, postController.createPost);
router.get('/posts/:topicId', postController.getPostsByTopic);
router.delete('/posts/:postId', auth, postController.deletePost);

module.exports = router;
