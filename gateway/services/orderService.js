const axios = require('axios');

exports.getOrders = async (token) => {
  try {
    const response = await axios.get('http://order-service:3002/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Order service getOrders error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to get orders');
  }
};

exports.getOrder = async (token, id) => {
  try {
    const response = await axios.get(`http://order-service:3002/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Order service getOrder error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to get order');
  }
};

exports.createOrder = async (token, items, totalAmount) => {
  try {
    const response = await axios.post(
      'http://order-service:3002/api/orders',
      { items, totalAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return {
      message: response.data.message,
      order: response.data.order
    };
  } catch (error) {
    console.error('Order service createOrder error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

exports.validateOrder = async (token, orderId) => {
  try {
    const response = await axios.post(
      `http://order-service:3002/api/orders/${orderId}/validate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return {
      message: response.data.message,
      order: response.data.order
    };
  } catch (error) {
    console.error('Order service validateOrder error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to validate order');
  }
};