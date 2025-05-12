const { sendEmail } = require('./email');

sendEmail({
  orderId: 'TEST1234',
  status: 'confirmée',
  timestamp: new Date().toISOString()
});
