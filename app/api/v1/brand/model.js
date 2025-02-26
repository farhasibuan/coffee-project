const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../utils/config_db");


const modelBrand = sequelize.define(
  "brand",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "brands",
    timestamps: false,
  }
);


module.exports = { modelBrand };
