const modelOrder = require("./model");
const path = require ("path")
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
        const { nama } = req.body;
        const logoFile = req.file ? req.file.filename : null;

        if (!nama) {
            return res.status(400).json({ message: "Nama tidak boleh kosong" });
        }

        if (!logoFile) {
            return res.status(400).json({ message: "Logo tidak boleh kosong" });
        }

        
        const existingNama = await modelOrder.findOne({ where: { nama } });
        if (existingNama) {
            return res.status(400).json({ message: "Nama sudah digunakan" });
        }

        
        const existingLogo = await modelOrder.findOne({ where: { logo: logoFile } });
        if (existingLogo) {
            return res.status(400).json({ message: "Logo sudah digunakan" });
        }

     
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

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await modelOrder.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        
        if (order.logo) {
            const imagePath = path.join(__dirname, "../../../public/uploads", order.logo);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.error("Gagal menghapus logo:", err.message);
            }
        }

        await order.destroy();

        res.status(200).json({ 
            status: 200,
            message: "Data order berhasil dihapus"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { getAllOrders, createOrder, deleteOrder };
