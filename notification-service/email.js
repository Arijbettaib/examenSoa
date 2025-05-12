const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

exports.sendEmail = async ({ orderId, status, timestamp }) => {
  const mailOptions = {
    from: '"PharmaExpress 🚀" <no-reply@pharmaexpress.com>',
    to: process.env.NOTIF_EMAIL_TO,
    subject: `🔔 Mise à jour de la commande ${orderId}`,
    html: `
      <h2>Suivi de commande</h2>
      <p>La commande <strong>${orderId}</strong> a été mise à jour :</p>
      <ul>
        <li><strong>Statut :</strong> ${status}</li>
        <li><strong>Date :</strong> ${new Date(timestamp).toLocaleString()}</li>
      </ul>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email envoyé pour la commande ${orderId}`);
};
