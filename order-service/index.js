const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/orders', orderRoutes);

// Socket.IO Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Partage du serveur WebSocket avec les routes
app.set('io', io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => console.log(`🚀 Order-Service running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB Error:", err));
