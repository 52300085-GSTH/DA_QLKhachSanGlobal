const express = require('express');
const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. KẾT NỐI SQL (PostgreSQL)
const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// 2. KẾT NỐI NoSQL (MongoDB)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB (Hotel Catalog)'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Định nghĩa Schema cho NoSQL (Hotel Catalog)
const HotelCatalogSchema = new mongoose.Schema({
    hotel_id: Number,
    description: String,
    amenities: [String],
    images: [String]
});
const HotelCatalog = mongoose.model('HotelCatalog', HotelCatalogSchema);

// --- CÁC API CHÍNH ---

// API 1: Tìm kiếm khách sạn (Ưu tiên AP - NoSQL)
app.get('/api/hotels/:id', async (req, res) => {
    try {
        // Lấy thông tin mô tả từ MongoDB
        const catalog = await HotelCatalog.findOne({ hotel_id: req.params.id });
        // Lấy thông tin giá/trạng thái từ Postgres
        const rooms = await pgPool.query('SELECT * FROM Rooms WHERE HotelID = $1', [req.params.id]);
        
        res.json({ catalog, rooms: rooms.rows });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API 2: Đặt phòng (Sử dụng Pessimistic Locking - SQL)
app.post('/api/booking', async (req, res) => {
    const { roomId, guestName } = req.body;
    const client = await pgPool.connect();

    try {
        await client.query('BEGIN'); // Bắt đầu Transaction

        // THỰC HIỆN KHÓA BI QUAN (Pessimistic Locking)
        // Lệnh FOR UPDATE sẽ khóa dòng này lại, không cho transaction khác sửa cho đến khi xong
        const roomCheck = await client.query(
            'SELECT * FROM Rooms WHERE ID = $1 AND Status = $2 FOR UPDATE',
            [roomId, 'AVAILABLE']
        );

        if (roomCheck.rows.length === 0) {
            throw new Error('Phòng không trống hoặc đã có người khác đang đặt!');
        }

        // Tạo đơn đặt phòng
        await client.query(
            'INSERT INTO Bookings (RoomID, GuestName) VALUES ($1, $2)',
            [roomId, guestName]
        );

        // Cập nhật trạng thái phòng
        await client.query(
            'UPDATE Rooms SET Status = $1 WHERE ID = $2',
            ['OCCUPIED', roomId]
        );

        await client.query('COMMIT'); // Hoàn tất và nhả khóa
        res.json({ message: 'Đặt phòng thành công!' });

    } catch (err) {
        await client.query('ROLLBACK'); // Hủy nếu có lỗi
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// API 3: Báo cáo Top 3 Doanh thu (Window Function)
app.get('/api/report/top-rooms', async (req, res) => {
    const query = `
        SELECT * FROM (
            SELECT HotelID, ID as RoomID, Rate,
            DENSE_RANK() OVER (PARTITION BY HotelID ORDER BY Rate DESC) as rank
            FROM Rooms
        ) ranked_rooms WHERE rank <= 3
    `;
    const result = await pgPool.query(query);
    res.json(result.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));