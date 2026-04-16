// backend/routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

router.get('/:id', hotelController.getHotelDetail);

module.exports = router;