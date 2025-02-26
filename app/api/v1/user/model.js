const { DataTypes } = require("sequelize");
const sequelize = require("../../../utils/config_db.js");

const User = sequelize.define("user", {
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
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    jenisKelamin: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    noHandphone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    tanggalLahir : {
        type: DataTypes.DATE,
        allowNull: false   
    },
    kota: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
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

module.exports = User;
