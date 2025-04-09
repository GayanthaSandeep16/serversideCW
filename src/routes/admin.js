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
        { model: User, attributes: ['email'] }, // Include user email
        { model: ApiKeyUsage }, // Include usage data
      ],
    });
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving API keys', details: error.message });
  }
});

// Revoke any API key (admin only)
router.post('/revoke-key/:id', authMiddlewareAdmin, async (req, res) => {
  try {
    const keyId = req.params.id;
    await ApiKey.update({ isActive: false }, { where: { id: keyId } });
    res.json({ message: 'API key revoked' });
  } catch (error) {
    res.status(500).json({ error: 'Error revoking API key', details: error.message });
  }
});

// View user's own API keys (available to all authenticated users)
router.get('/my-api-keys', authMiddleware, async (req, res) => {
  try {
    const apiKeys = await ApiKey.findAll({
      where: { userId: req.session.userId },
      include: [{ model: ApiKeyUsage }],
    });
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving your API keys', details: error.message });
  }
});

// Generate new API key (available to all authenticated users)
router.post('/generate-key', authMiddleware, async (req, res) => {
  try {
    const apiKeyValue = generateApiKey();
    const apiKey = await ApiKey.create({
      userId: req.session.userId,
      apiKey: apiKeyValue,
      isActive: true,
    });
    await apiKey.createApiKeyUsage();
    res.json({ message: 'API key generated', apiKey: apiKeyValue });
  } catch (error) {
    res.status(500).json({ error: 'Error generating API key', details: error.message });
  }
});

module.exports = router;