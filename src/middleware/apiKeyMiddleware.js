const ApiKey = require('../models/ApiKey');

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers['authorization'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required in Authorization header' });
  }
  try {
    const key = await ApiKey.findOne({ where: { apiKey, isActive: true } });
    if (!key) {
      return res.status(401).json({ error: 'Invalid or inactive API key' });
    }
    req.apiKey = key; 
    next();
  } catch (error) {
    res.status(500).json({ error: 'API key validation failed', details: error.message });
  }
};

module.exports = apiKeyMiddleware;