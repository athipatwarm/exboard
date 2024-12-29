const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
  try {
    // Log incoming token
    console.log('Incoming token:', req.cookies.token);

    const token = req.cookies.token; // Get the token from the cookie

    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);  // Verify token
    console.log('Decoded JWT:', decoded); // Log decoded token

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      throw new Error('Authentication failed');
    }

    // Ensure the token hasn't been revoked
    const tokenObject = user.tokens.find(t => t.token === token);
    if (tokenObject.revoked) {
      throw new Error('Token has been revoked');
    }

    req.token = token;  // Attach token to request object
    req.user = user;    // Attach user object to request object
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.error('Access denied. Admins only.');
    return res.status(403).send({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { auth, adminAuth };
