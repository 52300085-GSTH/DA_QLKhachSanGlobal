const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Đường dẫn: GET /api/reports/top-rooms
router.get('/top-rooms', reportController.getTopRoomsReport);

module.exports = router;