const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ Error: JWT_SECRET environment variable is not set');
  process.exit(1);
}

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/auth-service')
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Auth-Service running on port ${PORT}`));
  }).catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });
