const authService = require('./services/authService');
const orderService = require('./services/orderService');

module.exports = {
  Query: {
    getUser: async (_, { token }) => {
      try {
        return await authService.verifyToken(token);
      } catch (error) {
        console.error('Error in getUser resolver:', error);
        throw new Error(error.message || 'Failed to get user');
      }
    },
    
    getOrders: async (_, { token }) => {
      try {
        return await orderService.getOrders(token);
      } catch (error) {
        console.error('Error in getOrders resolver:', error);
        throw new Error(error.message || 'Failed to get orders');
      }
    },
    
    getOrder: async (_, { token, id }) => {
      try {
        return await orderService.getOrder(token, id);
      } catch (error) {
        console.error('Error in getOrder resolver:', error);
        throw new Error(error.message || 'Failed to get order');
      }
    }
  },
  
  Mutation: {
    login: async (_, { email, password }) => {
      try {
        return await authService.login(email, password);
      } catch (error) {
        console.error('Error in login resolver:', error);
        throw new Error(error.message || 'Login failed');
      }
    },
    
    register: async (_, { name, email, password }) => {
      try {
        return await authService.register(name, email, password);
      } catch (error) {
        console.error('Error in register resolver:', error);
        throw new Error(error.message || 'Registration failed');
      }
    },
    
    createOrder: async (_, { token, items, totalAmount }) => {
      try {
        return await orderService.createOrder(token, items, totalAmount);
      } catch (error) {
        console.error('Error in createOrder resolver:', error);
        throw new Error(error.message || 'Failed to create order');
      }
    },
    
    validateOrder: async (_, { token, orderId }) => {
      try {
        return await orderService.validateOrder(token, orderId);
      } catch (error) {
        console.error('Error in validateOrder resolver:', error);
        throw new Error(error.message || 'Failed to validate order');
      }
    }
  }
};
