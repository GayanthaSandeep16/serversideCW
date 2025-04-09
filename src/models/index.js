const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const ApiKey = require('./ApiKey');
const ApiKeyUsage = require('./ApiKeyUsage');

// Define relationships
User.hasMany(ApiKey, { foreignKey: 'userId' });
ApiKey.belongsTo(User, { foreignKey: 'userId' });

ApiKey.hasOne(ApiKeyUsage, { foreignKey: 'apiKeyId' });
ApiKeyUsage.belongsTo(ApiKey, { foreignKey: 'apiKeyId' });

// Export models
module.exports = {
  sequelize,
  User,
  ApiKey,
  ApiKeyUsage,
};

// Sync database (optional, run once or in your app setup)
sequelize.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Sync error:', err));