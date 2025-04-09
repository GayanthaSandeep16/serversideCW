const express = require('express');
const router = express.Router();
const { authMiddleware, authMiddlewareAdmin } = require('../middleware/authMiddleware');
const ApiKey = require('../models/ApiKey');
const ApiKeyUsage = require('../models/ApiKeyUsage');
const User = require('../models/User');
const { generateApiKey } = require('../utils/apiKeyGenerator');

// View all API keys (admin only)
router.get('/api-keys', authMiddlewareAdmin, async (req, res) => {
  try {
    const apiKeys = await ApiKey.findAll({
      include: [
        { model: User, attributes: ['email'] },
        { model: ApiKeyUsage }, 
      ],
    });
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving API keys', details: error.message });
  }
});



module.exports = router;