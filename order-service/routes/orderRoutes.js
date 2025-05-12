const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/authMiddleware');
const { sendStatusUpdate } = require('../kafka/producer');

// 🛒 Créer une commande
router.post('/', authenticateToken, async (req, res) => {
  const { items, total, deliveryAddress, paymentMethod } = req.body;

  try {
    const newOrder = new Order({
      userId: req.user.id,
      items,
      total,
      deliveryAddress,
      paymentMethod,
      status: 'Reçue',
      statusHistory: [{ status: 'Reçue', timestamp: new Date() }]
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Commande créée avec succès', order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// 📋 Lister les commandes de l'utilisateur
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// 🔎 Détail d'une commande
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

// ✏️ Mettre à jour le statut + notifier Socket.IO et Kafka
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        $set: { status },
        $push: { statusHistory: { status, timestamp: new Date() } }
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });

    // 🔴 Notifier clients via WebSocket
    const io = req.app.get('io');
    io.emit('orderStatusUpdate', {
      orderId: order._id.toString(),
      status: order.status
    });

    // 🟢 Envoyer le changement de statut à Kafka (notification-service)
    await sendStatusUpdate({
      orderId: order._id.toString(),
      status: order.status,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Statut mis à jour', order });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur : ' + err.message });
  }
});

module.exports = router;
