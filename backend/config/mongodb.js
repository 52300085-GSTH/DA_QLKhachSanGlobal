// backend/config/mongodb.js
const mongoose = require('mongoose');

// Ưu tiên dùng MONGODB_URI (localhost) nếu có, không thì mới dùng cái Cloud
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected to:', uri.includes('localhost') ? 'Localhost' : 'Cloud Atlas');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;