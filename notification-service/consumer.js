const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
dotenv.config();
const { sendEmail } = require('./email');


const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'notif-group' });

const run = async () => {
  console.log("🔧 KAFKA_BROKER =", process.env.KAFKA_BROKER);

  await consumer.connect();
  await consumer.subscribe({ topic: 'order-status', fromBeginning: true });

  console.log('📬 Notification-Service is listening to "order-status"...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("🔔 Nouveau message Kafka :", data);

      try {
        await sendEmail(data);
      } catch (err) {
        console.error("❌ Erreur envoi email:", err.message);
      }
    }
  });
};

run().catch(console.error);
