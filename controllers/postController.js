const mongoose = require('mongoose');
const Post = require('../models/Post');
const Topic = require('../models/Topic');

const Post = require('../models/Post');
const Topic = require('../models/Topic');

// Create a new post
exports.createPost = async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must be logged in to create a post' });
  }

  const { title, content, topic } = req.body;

  if (!title || !content || !topic) {
    return res.status(400).send({ error: 'Title, content, and topic are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(topic)) {
    return res.status(400).send({ error: 'Invalid topic ID' });
  }

  try {
    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(404).send({ error: 'Topic not found' });
    }

    const post = new Post({
      title,
      content,
      topic,
      author: req.user._id
    });

    await post.save();

    topicExists.posts.push(post._id);
    await topicExists.save(); 

    res.status(201).send(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).send({ error: 'Failed to create post' });
  }
};

