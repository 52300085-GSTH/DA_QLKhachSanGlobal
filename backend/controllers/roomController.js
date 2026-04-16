// backend/controllers/roomController.js
const pgPool = require('../config/db'); 
const HotelDetail = require('../models/HotelDetail'); 

// 1. API lấy danh sách phòng
exports.getAllRooms = async (req, res) => {
    try {
        const result = await pgPool.query('SELECT * FROM rooms ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// 2. Cập nhật Giá (SQL)
exports.updateRoomPrice = async (req, res) => {
    const { id } = req.params; // Lấy tham số :id từ URL
    const { newPrice } = req.body;
    try {
        const result = await pgPool.query(
            'UPDATE rooms SET price_per_night = $1 WHERE id = $2 RETURNING *',
            [parseFloat(newPrice), id] // Ép kiểu số để SQL không lỗi
        );
        if (result.rowCount === 0) return res.status(404).json({ error: "Không tìm thấy ID" });
        res.json({ message: "SQL OK", room: result.rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Cập nhật Chi tiết (NoSQL)
exports.updateRoomDetail = async (req, res) => {
    const { id } = req.params; // Vẫn lấy :id từ URL cho đồng bộ
    const { description, amenities, image_url } = req.body;
    try {
        const updated = await HotelDetail.findOneAndUpdate(
            { room_id: parseInt(id) }, // Tìm trong MongoDB bằng room_id = id của SQL
            { description, amenities, image_url },
            { returnDocument: 'after', upsert: true }
        );
        res.json({ message: "NoSQL OK", data: updated });
    } catch (err) { res.status(500).json({ error: err.message }); }
};



// 4. Thêm phòng mới (Hybrid)
exports.createFullRoom = async (req, res) => {
    const { hotel_id, room_number, price, description, amenities, image_url } = req.body;
    try {
        const pgResult = await pgPool.query(
            'INSERT INTO rooms (hotel_id, room_number, price_per_night) VALUES ($1, $2, $3) RETURNING id',
            [parseInt(hotel_id), room_number, parseFloat(price)]
        );
        const newRoomId = pgResult.rows[0].id;

        const newDetail = new HotelDetail({
            hotel_id: parseInt(hotel_id),
            room_id: newRoomId,
            description,
            amenities, 
            image_url
        });
        await newDetail.save();

        res.status(201).json({ message: "Tạo phòng thành công!", sql_id: newRoomId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Xóa phòng (Hybrid)
exports.deleteRoom = async (req, res) => {
    const { room_id } = req.params; 
    try {
        await pgPool.query('DELETE FROM rooms WHERE id = $1', [room_id]);
        await HotelDetail.deleteOne({ room_id: parseInt(room_id) });
        res.json({ message: "Đã xóa sạch sẽ ở cả 2 DB!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Lấy log từ PostgreSQL Trigger
exports.getPriceLogs = async (req, res) => {
    try {
        const result = await pgPool.query(
            'SELECT * FROM RateChangeLog ORDER BY change_date DESC LIMIT 10'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};