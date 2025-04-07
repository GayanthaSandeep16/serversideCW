// This middleware checks if the user is authenticate
// and user ID. If the user is not authenticate  it sends a 401 Unauthorized response.


const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized - Please log in' });
  }
  next();
};

module.exports = authMiddleware;