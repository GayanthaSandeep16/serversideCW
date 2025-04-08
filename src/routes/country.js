const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
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
    
   
    await ApiKeyUsage.update(
      { 
        usageCount: Sequelize.literal("usageCount + 1"), 
        lastUsed: new Date() 
      },
      { 
        where: { apiKeyId: req.apiKey.id } 
      }
    );
    
    res.json(data);
  } catch (error) {
    console.error("Error fetching country data:", error); // Better error logging
    res.status(500).json({ 
      error: "Failed to fetch country data", 
      details: error.message 
    });
  }
});

module.exports = router;