const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/topics', topicController.getAllTopics);
router.post('/topics', auth, adminAuth, topicController.createTopic);
router.get('/topics/:topicName', topicController.getTopicByName);
router.delete('/topics/:id', auth, adminAuth, topicController.deleteTopic);

module.exports = router;
