const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ApiKey = require('../models/ApiKey');
const ApiKeyUsage = require('../models/ApiKeyUsage');
const { generateApiKey } = require('../utils/apiKeyGenerator');

// Admin dashboard - view API keys
router.get('/',  async (req, res) => {
  try {
    const apiKeys = await ApiKey.findAll({
      where: { userId: req.session.userId },
      include: [{ model: ApiKeyUsage }],
    });
    res.render('admin', { apiKeys });
  } catch (error) {
    res.status(500).send('Error retrieving API keys');
  }
});

// Generate new API key
router.post('/generate-key', authMiddleware, async (req, res) => {
  try {
    const apiKeyValue = generateApiKey();
    const apiKey = await ApiKey.create({
      userId: req.session.userId,
      apiKey: apiKeyValue,
      isActive: true,
    });
    await apiKey.createApiKeyUsage();
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Error generating API key');
  }
});

// Revoke API key
router.post('/revoke-key/:id', authMiddleware, async (req, res) => {
  try {
    const keyId = req.params.id;
    await ApiKey.update(
      { isActive: false },
      { where: { id: keyId, userId: req.session.userId } }
    );
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Error revoking API key');
  }
});

module.exports = router;