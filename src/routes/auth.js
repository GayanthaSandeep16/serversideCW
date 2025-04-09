const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const ApiKey = require("../models/ApiKey");
const { generateApiKey } = require("../utils/apiKeyGenerator");
const {authMiddleware, authMiddlewareAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User");

//register new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
});

//login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    req.session.userId = user.id;
    res.json({ message: "Logged in", userId: user.id, role: user.role || "user" });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});


// View user's own API keys 
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
    res.json({ message: 'API key generated', apiKey: apiKeyValue });
  } catch (error) {
    res.status(500).json({ error: 'Error generating API key', details: error.message });
  }
});

//revoke API key 
router.post('/revoke-key/:id', authMiddleware, async (req, res) => {
  try {
    const keyId = req.params.id;
    await ApiKey.update({ isActive: false }, { where: { id: keyId } });
    res.json({ message: 'API key revoked' });
  } catch (error) {
    res.status(500).json({ error: 'Error revoking API key', details: error.message });
  }
});

//logout user
router.get('/logout', authMiddleware, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out', details: err.message });
    }
    res.json({ message: 'Logged out successfully' });
  });
});


module.exports = router;