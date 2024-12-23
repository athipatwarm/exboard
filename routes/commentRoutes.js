const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

router.post('/comments', auth, commentController.createComment);
// router.patch('/comments/:id', auth, commentController.editComment);
router.get('/comments', commentController.getAllComments);
router.get('/comments/:id', commentController.getCommentById);
router.patch('/comments/:id', auth, commentController.updateComment);
router.delete('/comments/:id', auth, commentController.deleteComment);
router.delete('/comments/soft/:id', auth, commentController.softDeleteComment);
router.delete('/comments/hard/:id', auth, commentController.hardDeleteComment);
router.post('/comments/:id/report', auth, commentController.reportComment);

module.exports = router;
