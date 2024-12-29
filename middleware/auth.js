const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Get the token from the cookie

    if (!token) {
      console.log('No token provided');
      return res.status(400).send({ error: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log('Decoded token:', decoded);

    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      console.log('User not found or token mismatch');
      return res.status(400).send({ error: 'Authentication failed' });
    }

    // Ensure the token hasn't been revoked
    const tokenObject = user.tokens.find(t => t.token === token);
    if (tokenObject.revoked) {
      console.log('Token has been revoked');
      return res.status(400).send({ error: 'Token has been revoked' });
    }

    req.token = token;  // Attach token to request object
    req.user = user;    // Attach user object to request object
    next();
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(400).send({ error: 'Please authenticate.' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: Admins only');
    return res.status(403).send({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { auth, adminAuth };
