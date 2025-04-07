const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");
const ApiKey = require("./ApiKey");


const ApiKeyUsage = sequelize.define('ApiKeyUsage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    apiKeyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ApiKey, key: 'id' },
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastUsed: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: false,
  });


  //relationships between models
  ApiKey.hasOne(ApiKeyUsage, {
    foreignKey: "apiKeyId",
  });

  ApiKeyUsage.belongsTo(ApiKey, {
    foreignKey: "apiKeyId",
  });


  module.exports = ApiKeyUsage;