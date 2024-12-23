const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const {auth,adminAuth} = require('../middleware/auth.js')

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);
router.post('/users', userController.createUser);
router.get('/users', auth, adminAuth, userController.getAllUsers);
router.patch('/users/me', userController.updateProfile);
router.get('/users/:id', auth, adminAuth, userController.getUserById);
router.patch('/users/:id', userController.updateUser);
router.delete('/users/:id', auth, adminAuth, userController.deleteUser);

module.exports = router;
