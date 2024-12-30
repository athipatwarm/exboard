const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { auth, adminAuth } = require('../middleware/auth');

// Routes for topics
router.get('/topics', topicController.getAllTopics);
router.post('/topics', auth, adminAuth, topicController.createTopic);
router.get('/topics/:topicName', topicController.getTopicByName);

module.exports = router;
