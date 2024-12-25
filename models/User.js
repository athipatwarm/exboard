const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
    revoked: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  
  // Remove old tokens, keeping only the current one
  user.tokens = [];  // Clear any existing tokens
  
  // Generate a new token
  const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_KEY, { expiresIn: '8h' });
  
  // Save the new token to the database
  user.tokens.push({ token });
  await user.save();
  
  return token;
};


// Check password
userSchema.methods.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
