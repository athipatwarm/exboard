const Topic = require('../models/Topic');
const User = require('../models/User');

// Create a new topic
exports.createTopic = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const existingTopic = await Topic.findOne({ title });
  if (existingTopic) {
    return res.status(400).json({ error: 'A topic with this title already exists.' });
  }

  try {
    const topic = new Topic({
      title,
      description,
      author: req.user._id,
      moderators: [req.user._id], 
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic.', details: error.message });
  }
};

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find({})
      .populate('category', 'name') 
      .populate('author', 'name') 
      .populate('moderators', 'name'); 
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics.', details: error.message });
  }
};

// Get topic by name (already included posts)
exports.getTopicByName = async (req, res) => {
  const { topicName } = req.params;

  try {
    const topic = await Topic.findOne({ title: topicName })
      .populate('category', 'name')
      .populate('author', 'username') 
      .populate('moderators', 'name')
      .populate({
        path: 'posts', 
        populate: { path: 'author', select: 'username' } 
      });
    
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found.' });
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topic.', details: error.message });
  }
};


// Update a topic
exports.updateTopic = async (req, res) => {
  const { id } = req.params;

  try {
    const topic = await Topic.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found.' });
    }
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic.', details: error.message });
  }
};

// Delete a topic
exports.deleteTopic = async (req, res) => {
  const { id } = req.params;

  try {
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found.' });
    }
    res.status(200).json({ message: 'Topic deleted successfully.', topic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic.', details: error.message });
  }
};

// Request topic creation
exports.requestCreateTopic = async (req, res) => {
  try {
    const topic = new Topic({
      ...req.body,
      requestedBy: req.user._id,
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to request topic creation.', details: error.message });
  }
};

// Approve a topic creation request
exports.approveTopicRequest = async (req, res) => {
  const { topicId } = req.params;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found.' });
    }

    if (!topic.requestedBy) {
      return res.status(400).json({ error: 'No request found for this topic.' });
    }

    topic.author = topic.requestedBy;
    topic.moderators.push(topic.requestedBy);
    topic.requestedBy = undefined; 
    await topic.save();

    const user = await User.findById(topic.author);
    user.role = 'moderator';
    await user.save();

    res.status(200).json({ message: 'Topic approved successfully.', topic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve topic request.', details: error.message });
  }
};
