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

// Delete a user by ID (Admin only)
exports.deleteUser = async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Register a new user
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
    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

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

    // Check if there is an existing valid token
    let token;
    const validToken = user.tokens.find(tokenObj => {
      try {
        jwt.verify(tokenObj.token, process.env.JWT_KEY);
        return true;
      } catch (error) {
        return false;
      }
    });

    if (validToken) {
      token = validToken.token;
    } else {
      token = await user.generateAuthToken();
    }

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    // Check for unique username and email
    if (user.isModified('username')) {
      const existingUser = await User.findOne({ username: user.username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).send({ error: 'Username already exists. Please choose another one.' });
      }
    }

    if (user.isModified('email')) {
      const existingEmail = await User.findOne({ email: user.email });
      if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
        return res.status(400).send({ error: 'Email already exists. Please choose another one.' });
      }
    }

    // Hash the new password before saving
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Logout a user
exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send();
    }

    user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== req.token);
    await user.save();

    res.status(200).send({ message: 'Successfully logged out' });
  } catch (error) {
    res.status(500).send({ error: 'Logout failed' });
  }
};

