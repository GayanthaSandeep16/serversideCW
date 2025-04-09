const User = require('../models/User');

// Middleware to check if user is authenticated
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized - Please log in' });
  }
  next();
};

// Middleware to check if user is authenticated and is an admin
const authMiddlewareAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized - Please log in' });
  }
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { authMiddleware, authMiddlewareAdmin };