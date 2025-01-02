const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  },
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  closed: {
    type: Boolean,
    default: false
  }
});

postSchema.pre('find', function() {
  this.populate('author', 'username').populate('reports', 'username');
});

module.exports = mongoose.model('Post', postSchema);
