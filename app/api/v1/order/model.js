const { DataTypes } = require("sequelize");
const sequelize = require("../../../utils/config_db.js");

const Order = sequelize.define("order", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true
});

// Sinkronisasi model dengan database
sequelize.sync();

module.exports = Order;
