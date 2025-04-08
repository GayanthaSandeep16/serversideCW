const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const ApiKey = sequelize.define(
  "ApiKey",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    apiKey: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  { timestamps: true }
);

//relationships between models
User.hasMany(ApiKey, { foreignKey: "userId" });
ApiKey.belongsTo(User, { foreignKey: "userId" });

module.exports = ApiKey;
