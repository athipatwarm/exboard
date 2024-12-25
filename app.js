const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const topicRoutes = require('./routes/topicRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const auth = require('./middleware/auth');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json());  // To parse incoming JSON request bodies
app.use(bodyParser.urlencoded({ extended: false })); // To parse URL-encoded bodies (optional, based on your needs)

// Serve static files (your frontend build)
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Routes
app.use('/api', userRoutes);  // Define your API routes
app.use('/api', categoryRoutes);
app.use('/api', topicRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

// Serve the frontend's index.html for any other route (useful for SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

module.exports = app;
