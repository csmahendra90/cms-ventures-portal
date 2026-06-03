// db/connect.js — MongoDB connection via Mongoose
// Usage: require('./db/connect') in server.js

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vertex-capital';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // Fall back to in-memory store — app still works
    console.warn('⚠️  Falling back to in-memory data store');
  }
}

module.exports = connectDB;
