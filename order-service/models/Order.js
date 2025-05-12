const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [{
    menuId: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  total: Number,
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String
  },
  paymentMethod: String,
  status: {
    type: String,
    enum: ['Reçue', 'Confirmée', 'En préparation', 'Prête', 'Livrée'],
    default: 'Reçue'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
