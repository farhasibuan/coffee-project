// Import Sequelize
const { DataTypes } = require("sequelize");

// Koneksi DB
const sequelize = require("../../../utils/config_db.js");

// Mendefinisikan struktur tabel
const Makanan = sequelize.define("makanan", {
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
    harga_baru: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    harga_lama: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    gambar: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "id"
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true
});


sequelize.sync();

module.exports = Makanan;
