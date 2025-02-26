const modelOrder = require("./model");

const baseUrl = "https://ahmad.rikpetik.site/uploads"; 

const getAllOrders = async (req, res) => {
    try {
        const orders = await modelOrder.findAll();

        const ordersImageUrl = orders.map(order => ({
            ...order.toJSON(),
            logo: order.logo ? `${baseUrl}/${order.logo}` : null
        }));

        res.status(200).json({
            status: 200,
            message: "Data order berhasil diambil",
            data: ordersImageUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOrder = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);

        const { nama } = req.body;
        const logoFile = req.file ? req.file.filename : null;

        if (!nama) {
            return res.status(400).json({ message: "Nama tidak boleh kosong" });
        }

        if (!logoFile) {
            return res.status(400).json({ message: "Logo tidak boleh kosong" });
        }

        // Cek apakah nama atau logo sudah ada di database
        const existingOrder = await modelOrder.findOne({
            where: {
                [Op.or]: [
                    { nama },
                    { logo: logoFile }
                ]
            }
        });

        if (existingOrder) {
            return res.status(400).json({ message: "Nama atau logo sudah digunakan" });
        }

        // Jika validasi lolos, buat order baru
        const newOrder = await modelOrder.create({
            nama,
            logo: logoFile
        });

        res.status(201).json({
            status: 201,
            message: "Data order berhasil ditambahkan",
            data: {
                ...newOrder.toJSON(),
                logo: `${baseUrl}/${newOrder.logo}`
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



module.exports = { getAllOrders, createOrder };
