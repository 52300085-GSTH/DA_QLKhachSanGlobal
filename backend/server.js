// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import cấu hình Database
require('./config/db'); 
const connectMongoDB = require('./config/mongodb');

// 2. Import các Routes
const roomRoutes = require('./routes/roomRoutes');
const reportRoutes = require('./routes/reportRoutes');
const hotelRoutes = require('./routes/hotelRoutes'); // <-- Đưa lên đây

const app = express();

// Khởi chạy kết nối MongoDB
connectMongoDB();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Khai báo các điểm cuối API (Endpoints)
app.use('/api/rooms', roomRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/hotels', hotelRoutes); // <-- Phải nằm TRƯỚC app.listen

// 5. Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server chuyên nghiệp đang chạy tại port ${PORT}`);
});