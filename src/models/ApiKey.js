const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const ApiKey = sequelize.define(
  "ApiKey",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ApiKey: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

//relationships between models
User.hasMany(ApiKey, {
  foreignKey: "userId",
});
ApiKey.belongsTo(User, {
  foreignKey: "userId",
});


module.exports = ApiKey;

