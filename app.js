const express = require('express');
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

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', topicRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

module.exports = app;