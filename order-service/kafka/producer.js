const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKERS]
});

const producer = kafka.producer();
producer.connect();

module.exports = {
  sendStatusUpdate: async (message) => {
    await producer.send({
      topic: 'order-status',
      messages: [{ value: JSON.stringify(message) }]
    });
    console.log("📤 Message Kafka envoyé:", message);
  }
};
