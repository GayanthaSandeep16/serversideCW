const ApiKey = require('../models/ApiKey');

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers['authorization'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required in Authorization header' });
  }
  try {
    const key = await ApiKey.findOne({ where: { apiKey } });
    if (!key) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    req.apiKeyId = key.id;
    next();
  } catch (error) {
    res.status(500).json({ error: 'API key validation failed', details: error.message });
  }
};

module.exports = apiKeyMiddleware;