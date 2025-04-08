const express = require("express");
const router = express.Router();
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const { getCountryData } = require("../services/countryService");
const ApiKeyUsage = require("../models/ApiKeyUsage");

router.get("/country/:name", apiKeyMiddleware, async (req, res) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({ error: "Country name is required" });
  }
  try {
    const data = await getCountryData(name);
    //update api key usage
    await ApiKeyUsage.update(
      { usageCount: Sequelize.literal("usageCount + 1"), lastUsed: new Date() },
      { where: { apiKeyId: req.apiKey.id } }
    );
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch country data", details: error.message }); // need enahance based on response from API
  }
});


module.exports = router;