const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the MONGO_URI from .env file to connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.error('MongoDB connection error:', err));
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
