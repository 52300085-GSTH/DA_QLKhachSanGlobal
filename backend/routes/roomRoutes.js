// backend/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// --- CÁC ROUTE TĨNH (STATIC) - ĐƯA LÊN ĐẦU ---

// 1. Route lấy tất cả phòng
router.get('/', roomController.getAllRooms);

// 6. Route lấy tất cả log (Phải để trên các route có :id)
router.get('/price-logs/all', roomController.getPriceLogs);

// 3. Route thêm phòng mới
router.post('/add-full', roomController.createFullRoom);


// --- CÁC ROUTE CÓ THAM SỐ (DYNAMIC) - ĐỂ Ở DƯỚI ---

// 2. Route cập nhật giá phòng
router.put('/:id/price', roomController.updateRoomPrice);
// 5. Route cập nhật chi tiết phòng
router.put('/:id/detail', roomController.updateRoomDetail);
// 4. Route xóa phòng
router.delete('/:id', roomController.deleteRoom);

module.exports = router;