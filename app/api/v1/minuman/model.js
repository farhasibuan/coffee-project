const { DataTypes } = require("sequelize");
const sequelize = require("../../../utils/config_db.js");

const Minuman = sequelize.define("minuman", {
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

module.exports = Minuman;
