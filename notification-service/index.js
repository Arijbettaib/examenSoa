// notification-service/index.js
const { Kafka } = require('kafkajs');
const nodemailer = require('nodemailer');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092']  // Assure-toi que ce nom correspond au container kafka dans Docker
});

const consumer = kafka.consumer({ groupId: 'notif-group' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-status', fromBeginning: true });

  console.log('📬 Notification-Service is listening to "order-status"...');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const content = JSON.parse(message.value.toString());
      console.log('🔔 Nouveau message Kafka :', content);

      // Envoi d'email
      await sendEmail(content.orderId, content.status, content.timestamp);
    },
  });
}

startConsumer().catch(console.error);
