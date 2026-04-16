const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    hotel_id: { type: Number, required: true },
    room_id: { type: Number }, 
    description: String,
    amenities: [String],
    image_url: String
});

// Kết nối trực tiếp tới collection 'hotelcatalogs' mà bạn đã có trong Compass
module.exports = mongoose.model('HotelDetail', hotelSchema, 'hotelcatalogs');