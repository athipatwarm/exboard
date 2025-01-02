const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a user by ID (Admin only for role changes)
exports.updateUser = async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the account.' });
  }
};


exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ error: 'Username already exists. Please choose another one.' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: 'Email already exists. Please choose another one.' });
    }

    const user = new User({ username, email, password });
    await user.save();
    const token = await user.generateAuthToken();

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,       // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Only set cookies over HTTPS in production
      sameSite: 'Strict',   // Helps prevent CSRF attacks
      maxAge: 15 * 60 * 1000  // Token expires in 15 minutes
    });

    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Login user and set token in cookie
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid login credentials' });
    }

    // Generate a new token
    const token = await user.generateAuthToken();

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,       // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Only set cookies over HTTPS in production
      sameSite: 'Strict',   // Helps prevent CSRF attacks
      maxAge: 15 * 60 * 1000  // Token expires in 15 minutes
    });

    res.send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, email, password, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found.' });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    if (password && newPassword) {
      console.log(`Attempting to update password for user ${user.email}`);
      console.log(`Old Password (provided): ${password}`);
      console.log(`New Password (provided): ${newPassword}`);

      // Verify current password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Encoded Old Password (DB): ${user.password}`);
      console.log(`Decoded Old Password Match: ${isMatch}`);

      if (!isMatch) {
        console.error('Current password is incorrect');
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }

      // Hash and save new password
      const encodedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = encodedNewPassword;
      console.log(`Encoded New Password (DB): ${encodedNewPassword}`);
    }

    await user.save();
    res.json({ username: user.username, email: user.email });

    console.log('Profile updated successfully');
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'An error occurred while updating the profile.' });
  }
};


// Logout a user from all devices (force logout from all other sessions)
exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Clear the user's token from the database (mark as revoked)
    user.tokens = user.tokens.filter(t => t.token !== req.token);
    await user.save();

    // Clear the token cookie
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Logout failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Logged out successfully.' });
};

