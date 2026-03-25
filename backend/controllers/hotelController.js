// backend/controllers/hotelController.js
const mongoose = require('mongoose');

// 1. Định nghĩa Schema (Cấu trúc dữ liệu)
const hotelSchema = new mongoose.Schema({
    hotel_id: { type: Number, required: true, unique: true },
    description: String,
    amenities: [String],
    image_url: String
});

// 2. Kiểm tra nếu Model đã tồn tại thì dùng lại, nếu chưa thì mới tạo (Tránh lỗi OverwriteModelError)
const HotelDetail = mongoose.models.HotelDetail || mongoose.model('HotelDetail', hotelSchema, 'hotelcatalogs');

exports.getHotelDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem id truyền vào có phải là số không
        const hotelIdNum = parseInt(id);
        if (isNaN(hotelIdNum)) {
            return res.status(400).json({ message: "ID khách sạn phải là một con số hợp lệ" });
        }

        // Tìm kiếm trong MongoDB
        const detail = await HotelDetail.findOne({ hotel_id: hotelIdNum });
        
        if (!detail) {
            return res.status(404).json({ 
                message: `Không tìm thấy thông tin cho khách sạn ID: ${id} trong collection hotelcatalogs`,
                id_searched: id 
            });
        }

        // Trả về dữ liệu thành công
        res.json(detail);

    } catch (err) {
        console.error("❌ Lỗi truy vấn MongoDB:", err);
        res.status(500).json({ 
            error: "Lỗi hệ thống khi truy xuất dữ liệu NoSQL",
            details: err.message 
        });
    }
};