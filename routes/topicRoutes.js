const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/topics/request', auth, topicController.requestCreateTopic);
router.patch('/topics/approve/:topicId', auth, adminAuth, topicController.approveTopicRequest);
router.patch('/topics/assign-moderator', auth, topicController.assignModerator); // Ensure this function exists
// router.patch('/topics/request-update/:topicId', auth, topicController.requestUpdateTopic);
// router.patch('/topics/request-delete/:topicId', auth, topicController.requestDeleteTopic);
// router.patch('/topics/approve-update/:topicId/:requestId', auth, adminAuth, topicController.handleUpdateRequest);
// router.patch('/topics/approve-delete/:topicId/:requestId', auth, adminAuth, topicController.handleDeleteRequest);
router.get('/topics', topicController.getAllTopics);
router.patch('/topics/:id', auth, adminAuth, topicController.updateTopic);
router.delete('/topics/:id', auth, adminAuth, topicController.deleteTopic);

//using
router.get('/topics/:topicName', topicController.getTopicByName);
router.post('/topics', auth, adminAuth, topicController.createTopic);

module.exports = router;
