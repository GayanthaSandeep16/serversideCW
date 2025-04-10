const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || '../database.sqlite',
});

module.exports = sequelize;