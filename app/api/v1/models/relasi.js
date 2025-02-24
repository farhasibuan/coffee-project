const modelMakanan = require("../makanan/model.js");
const modelMinuman = require("../minuman/model.js");
const modelUser = require("../user/model.js");

// Relasi antara User dan Makanan
modelUser.hasMany(modelMakanan, { foreignKey: "user_id" });
modelMakanan.belongsTo(modelUser, { foreignKey: "user_id" });

// Relasi antara User dan Minuman
modelUser.hasMany(modelMinuman, { foreignKey: "user_id" });
modelMinuman.belongsTo(modelUser, { foreignKey: "user_id" });

// Ekspor model
module.exports = {
    modelMakanan,
    modelMinuman,
    modelUser
};
