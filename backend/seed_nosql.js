const mongoose = require('mongoose');

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/hotel_catalog');
        console.log("Connected to MongoDB...");
        
        // Cập nhật Schema với đầy đủ các trường yêu cầu
        const hotelSchema = new mongoose.Schema({
            hotel_id: Number,
            name: String,
            description: String,
            amenities: [String],
            images: [String],
            last_updated: { type: Date, default: Date.now }
        });

        const Catalog = mongoose.model('HotelCatalog', hotelSchema);

        // Xóa dữ liệu cũ để tránh trùng lặp khi chạy lại file seed
        await Catalog.deleteMany({});
        
        // Thêm dữ liệu mẫu phong phú hơn
        await Catalog.insertMany([
            { 
                hotel_id: 1, 
                name: "Hanoi Luxury Hotel",
                description: "Khách sạn 5 sao trung tâm Hà Nội, view hồ Gươm.", 
                amenities: ["Wifi", "Pool", "Gym"],
                images: ["hanoi_view.jpg", "hanoi_room.jpg"]
            },
            { 
                hotel_id: 2, 
                name: "Da Nang Beach Resort",
                description: "Resort ven biển Mỹ Khê với bãi cát trắng.", 
                amenities: ["Beach", "Bar", "Pool"],
                images: ["danang_sea.jpg", "danang_bar.jpg"]
            }
        ]);

        console.log("✅ NoSQL Seeded Successfully with Full Schema!");
        process.exit();
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}
seed();