const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Create a new comment
exports.createComment = async (req, res) => {
  const { postId, content } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post || post.deletedAt) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (post.closed) {
      return res.status(403).send({ error: 'Comments are closed for this post.' });
    }

    const comment = new Comment({
      content,
      post: postId,
      author: req.user._id
    });

    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Edit a comment
exports.editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment || comment.deletedAt) {
      return res.status(404).send({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You do not have permission to edit this comment.' });
    }

    comment.content = content;
    await comment.save();
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Soft delete a comment
exports.softDeleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment || comment.deletedAt) {
      return res.status(404).send({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'You do not have permission to delete this comment.' });
    }

    comment.deletedAt = new Date();
    await comment.save();
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Hard delete a comment
exports.hardDeleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).send({ error: 'Comment not found' });
    }

    if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'You do not have permission to delete this comment.' });
    }

    await comment.remove();
    res.status(200).send({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Report a comment
exports.reportComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).send({ error: 'Comment not found' });
    }

    if (!comment.reports.includes(req.user._id)) {
      comment.reports.push(req.user._id);
      await comment.save();
    }

    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({}).populate('post').populate('author');
    res.status(200).send(comments);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get a comment by ID
exports.getCommentById = async (req, res) => {
  const _id = req.params.id;
  try {
    const comment = await Comment.findById(_id).populate('post').populate('author');
    if (!comment) {
      return res.status(404).send();
    }
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a comment by ID
exports.updateComment = async (req, res) => {
  const _id = req.params.id;
  try {
    const comment = await Comment.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!comment) {
      return res.status(404).send();
    }
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  const _id = req.params.id;
  try {
    const comment = await Comment.findByIdAndDelete(_id);
    if (!comment) {
      return res.status(404).send();
    }
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};
