const mongoose = require('mongoose');

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/hotel_catalog');
        console.log("Connected to MongoDB...");
        
        const Catalog = mongoose.model('HotelCatalog', new mongoose.Schema({
            hotel_id: Number,
            description: String,
            amenities: [String]
        }));

        await Catalog.deleteMany({});
        await Catalog.insertMany([
            { hotel_id: 1, description: "Khách sạn 5 sao Hà Nội", amenities: ["Wifi", "Pool"] },
            { hotel_id: 2, description: "Resort ven biển Đà Nẵng", amenities: ["Beach", "Bar"] }
        ]);

        console.log("✅ NoSQL Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seed();