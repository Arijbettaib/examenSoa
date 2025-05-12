const Order = require('../models/Order');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { sendNotification } = require('../kafka/producer');

// Charger le fichier .proto depuis le volume partagé
const PROTO_PATH = '/proto/commande.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const commandeProto = grpc.loadPackageDefinition(packageDefinition).commande;

const client = new commandeProto.CommandeService(
  'pharma-service:50051',
  grpc.credentials.createInsecure()
);

// Créer une commande
exports.createOrder = async (req, res) => {
  const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

  try {
    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: 'Reçue'
    });

    await order.save();
    res.status(201).json({ message: 'Commande créée', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lister toutes les commandes de l'utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Valider une commande via gRPC + Kafka
exports.validateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    client.ConfirmerCommande({ orderId }, async (err, response) => {
      if (err) {
        console.error('Erreur gRPC :', err);
        return res.status(500).json({ message: 'Erreur gRPC' });
      }

      order.status = response.status || status;
      await order.save();

      await sendNotification({
        orderId: order._id.toString(),
        userId: order.userId.toString(),
        status: order.status,
        timestamp: new Date().toISOString()
      });

      res.json({ message: 'Commande confirmée', order });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
