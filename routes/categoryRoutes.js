const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/categories', auth, adminAuth, categoryController.createCategory);
router.get('/categories', auth, categoryController.getAllCategories);
router.get('/categories/:id', auth, categoryController.getCategoryById);
router.patch('/categories/:id', auth, adminAuth, categoryController.updateCategory);
router.delete('/categories/:id', auth, adminAuth, categoryController.deleteCategory);

module.exports = router;
