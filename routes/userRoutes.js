const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);
router.post('/users', userController.createUser);
router.get('/users', auth, adminAuth, userController.getAllUsers);
router.patch('/users/me', auth, userController.updateProfile);
router.get('/me', auth, async (req, res) => {
    try {
      res.send(req.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(400).send({ error: 'Unable to fetch user data' });
    }
  });
router.get('/users/:id', auth, adminAuth, userController.getUserById);
router.patch('/users/:id', userController.updateUser);
router.delete('/users/:id', auth, adminAuth, userController.deleteUser);

module.exports = router;
