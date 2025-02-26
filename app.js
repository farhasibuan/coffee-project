const express = require("express");
const multer = require("multer");  // Import multer untuk upload file

// Import router dari setiap fitur
const routerMakanan = require("./app/api/v1/makanan/router");
const routerMinuman = require("./app/api/v1/minuman/router");
const routerUser = require("./app/api/v1/user/router");
const routerOrder = require("./app/api/v1/order/router");


const app = express();
const path = "/api/v1";

// Setup multer untuk upload file
const upload = multer({
    dest: "app/public/uploads/"  
});

// Middleware untuk parse request body
app.use(express.json());  // Untuk menerima JSON
app.use(express.urlencoded({ extended: true }));  // Untuk menerima data dari form-data

// Middleware untuk akses file statis, seperti gambar
app.use(express.static("public"));
const pathStatic = require("path");
app.use("/uploads", express.static(pathStatic.join(__dirname, "app/public/uploads")));

// Gunakan router untuk setiap fitur
app.use(path, routerMakanan);
app.use(path, routerMinuman);
app.use(path, routerUser);
app.use(path, routerOrder);


// Menjalankan server
app.listen(3000, () => {
    console.log('jalan ngab');
    
})