const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth } = require('../middleware/auth');

router.post('/posts', auth, postController.createPost);
router.get('/posts', auth, postController.getAllPosts);
router.get('/posts/:id', auth, postController.getPostById);
router.patch('/posts/:id', auth, postController.updatePost);
router.delete('/posts/soft/:id', auth, postController.softDeletePost);
router.delete('/posts/hard/:id', auth, postController.hardDeletePost);
router.post('/posts/:id/report', auth, postController.reportPost);
router.patch('/posts/close/:id', auth, postController.closePost);
router.delete('/posts/:id', auth, postController.deletePost);

module.exports = router;
