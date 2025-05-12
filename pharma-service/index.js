const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Charger le fichier .proto
const PROTO_PATH = path.join(__dirname, '../proto/commande.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const commandeProto = grpc.loadPackageDefinition(packageDefinition).commande;

// Implémentation des méthodes gRPC
const commandeService = {
  ConfirmerCommande: (call, callback) => {
    const { orderId } = call.request;
    console.log(`✅ Commande ${orderId} confirmée`);
    callback(null, {
      status: 'confirmed',
      message: `Commande ${orderId} confirmée avec succès.`
    });
  },

  RejeterCommande: (call, callback) => {
    const { orderId } = call.request;
    console.log(`❌ Commande ${orderId} rejetée`);
    callback(null, {
      status: 'rejected',
      message: `Commande ${orderId} rejetée.`
    });
  }
};

// Démarrage du serveur
const server = new grpc.Server();
server.addService(commandeProto.CommandeService.service, commandeService);

const PORT = process.env.PORT || 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`🚀 Pharma-Service gRPC running on port ${PORT}`);
  server.start();
});
