const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Get the token from the cookie
    if (!token) {
      return res.status(400).send({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      return res.status(400).send({ error: 'Authentication failed' });
    }

    const tokenObject = user.tokens.find(t => t.token === token);
    if (tokenObject.revoked) {
      return res.status(400).send({ error: 'Token has been revoked' });
    }

    req.token = token; // Attach token to request object
    req.user = user;   // Attach user object to request object
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(400).send({ error: 'Please authenticate.' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { auth, adminAuth };
