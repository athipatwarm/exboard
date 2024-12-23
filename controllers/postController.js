const Post = require('../models/Post');
const Topic = require('../models/Topic');

// Create a new post
exports.createPost = async (req, res) => {
  const post = new Post({
    ...req.body,
    author: req.user._id
  });
  try {
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ deletedAt: null }).populate('topic').populate('author');
    res.status(200).send(posts);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get a post by ID
exports.getPostById = async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Post.findOne({ _id, deletedAt: null }).populate('topic').populate('author');
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Post.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Post.findByIdAndDelete(_id);
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Soft delete a post
exports.softDeletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'You do not have permission to delete this post.' });
    }

    post.deletedAt = new Date();
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Hard delete a post
exports.hardDeletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'You do not have permission to delete this post.' });
    }

    await post.remove();
    res.status(200).send({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Report a post
exports.reportPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (!post.reports.includes(req.user._id)) {
      post.reports.push(req.user._id);
      await post.save();
    }

    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Close a post
exports.closePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).send({ error: 'You do not have permission to close this post.' });
    }

    post.closed = true;
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Other existing methods...
