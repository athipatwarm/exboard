const Topic = require('../models/Topic');
const User = require('../models/User');

// Create a new topic
exports.createTopic = async (req, res) => {
  const topic = new Topic({
    ...req.body,
    author: req.user._id,
    moderators: [req.user._id]
  });
  try {
    await topic.save();
    res.status(201).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find({}).populate('category').populate('author');
    res.status(200).send(topics);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get a topic by ID
exports.getTopicById = async (req, res) => {
  const _id = req.params.id;
  try {
    const topic = await Topic.findById(_id).populate('category').populate('author');
    if (!topic) {
      return res.status(404).send();
    }
    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a topic by ID
exports.updateTopic = async (req, res) => {
  const _id = req.params.id;
  try {
    const topic = await Topic.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!topic) {
      return res.status(404).send();
    }
    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a topic by ID
exports.deleteTopic = async (req, res) => {
  const _id = req.params.id;
  try {
    const topic = await Topic.findByIdAndDelete(_id);
    if (!topic) {
      return res.status(404).send();
    }
    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Request to create a new topic
exports.requestCreateTopic = async (req, res) => {
  const topic = new Topic({
    ...req.body,
    requestedBy: req.user._id
  });
  try {
    await topic.save();
    res.status(201).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Approve topic creation request and promote user to moderator for that topic
exports.approveTopicRequest = async (req, res) => {
  const { topicId } = req.params;
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).send({ error: 'Topic not found' });
    }
    if (!topic.requestedBy) {
      return res.status(400).send({ error: 'No user requested this topic' });
    }

    topic.author = topic.requestedBy;
    topic.moderators.push(topic.requestedBy);
    topic.requestedBy = undefined; // Clear the request
    
    await topic.save();

    // Promote the user to moderator for this topic
    const user = await User.findById(topic.author);
    user.role = 'moderator';
    await user.save();

    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Approve or reject an update request
exports.handleUpdateRequest = async (req, res) => {
  const { topicId, requestId } = req.params;
  const { action } = req.body; // action can be 'approve' or 'reject'
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).send({ error: 'Topic not found' });
    }

    const updateRequest = topic.updateRequests.id(requestId);
    if (!updateRequest) {
      return res.status(404).send({ error: 'Update request not found' });
    }

    if (action === 'approve') {
      topic.title = updateRequest.title || topic.title;
      topic.description = updateRequest.description || topic.description;
      updateRequest.status = 'approved';
    } else if (action === 'reject') {
      updateRequest.status = 'rejected';
    }

    await topic.save();
    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Approve or reject a delete request
exports.handleDeleteRequest = async (req, res) => {
  const { topicId, requestId } = req.params;
  const { action } = req.body; // action can be 'approve' or 'reject'
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).send({ error: 'Topic not found' });
    }

    const deleteRequest = topic.deleteRequests.id(requestId);
    if (!deleteRequest) {
      return res.status(404).send({ error: 'Delete request not found' });
    }

    if (action === 'approve') {
      await Topic.findByIdAndDelete(topicId);
      return res.status(200).send({ message: 'Topic deleted successfully' });
    } else if (action === 'reject') {
      deleteRequest.status = 'rejected';
    }

    await topic.save();
    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Assign a new moderator to a topic
exports.assignModerator = async (req, res) => {
  const { topicId, userId } = req.body;
  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).send({ error: 'Topic not found' });
    }

    if (!topic.moderators.includes(req.user._id)) {
      return res.status(403).send({ error: 'Only moderators can assign other moderators.' });
    }

    topic.moderators.push(userId);
    await topic.save();

    res.status(200).send(topic);
  } catch (error) {
    res.status(400).send(error);
  }
};
