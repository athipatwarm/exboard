const mongoose = require('mongoose');
const Post = require('../models/Post');
const Topic = require('../models/Topic');

exports.createPost = async (req, res) => {
  if (!req.user) {
    console.log("Backend log: User is not logged in.", req.user);
    return res.status(401).send({ error: 'You must be logged in to create a post' });
  }

  const { title, content, topic } = req.body;

  if (!title || !content || !topic) {
    console.log("Backend log: Missing required fields", { title, content, topic });
    return res.status(400).send({ error: 'Title, content, and topic are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(topic)) {
    console.log("Backend log: Invalid topic ID", topic);
    return res.status(400).send({ error: 'Invalid topic ID' });
  }

  try {
    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      console.log("Backend log: Topic not found", topic);
      return res.status(404).send({ error: 'Topic not found' });
    }

    const post = new Post({
      title,
      content,
      topic,
      author: req.user._id
    });

    console.log("Backend log: Saving new post", post);

    await post.save();

    // Ensure that the topic has a 'posts' array and push the post's ID
    if (!topicExists.posts) {
      topicExists.posts = [];  // Initialize the posts array if it doesn't exist
    }
    topicExists.posts.push(post._id);
    await topicExists.save();

    console.log("Backend log: Post created successfully", post);

    res.status(201).send(post);
  } catch (error) {
    console.error("Backend log: Error creating post", error);
    console.error("Backend log: Error details", error.stack);
    res.status(500).send({ error: 'Failed to create post' });
  }
};

exports.getPostsByTopic = async (req, res) => {
  try {
    const posts = await Post.find({ topic: req.params.topicId })
      .populate('author', 'username') 
      .populate('topic', 'title')    
      .exec();
    
    res.status(200).json(posts);
  } catch (error) {
    console.error("Backend log: Error fetching posts", error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

