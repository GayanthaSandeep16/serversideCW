const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ApiKey = sequelize.define(
  'ApiKey',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    apiKey: { type: DataTypes.STRING, unique: true, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }, 
  },
  { timestamps: true }
);



module.exports = ApiKey;