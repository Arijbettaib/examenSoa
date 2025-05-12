const axios = require('axios');

exports.login = async (email, password) => {
  try {
    const response = await axios.post('http://auth-service:3001/api/auth/login', {
      email,
      password,
    });
    
    return {
      token: response.data.token,
      user: response.data.user
    };
  } catch (error) {
    console.error('Auth service login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

exports.register = async (name, email, password) => {
  try {
    const response = await axios.post('http://auth-service:3001/api/auth/register', {
      name,
      email,
      password,
    });
    return response.data.message;
  } catch (error) {
    console.error('Auth service register error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

exports.verifyToken = async (token) => {
  try {
    const response = await axios.get('http://auth-service:3001/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Auth service verify token error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Token verification failed');
  }
};
