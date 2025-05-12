const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'order-status',
    messages: [
      {
        value: JSON.stringify({
          orderId: 'TEST123',
          status: 'Confirmée',
          timestamp: new Date().toISOString()
        })
      }
    ]
  });

  console.log('📤 Message de test envoyé');
  await producer.disconnect();
};

run().catch(console.error);
