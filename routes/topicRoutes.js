const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { auth, adminAuth } = require('../middleware/auth');

// Routes for topics
router.get('/topics', topicController.getAllTopics);  // This should be visible to all authenticated users
router.post('/topics', auth, adminAuth, topicController.createTopic);  // Admin only
router.patch('/topics/:id', auth, adminAuth, topicController.updateTopic);  // Admin only
router.delete('/topics/:id', auth, adminAuth, topicController.deleteTopic);  // Admin only

// Export the router
module.exports = router;
