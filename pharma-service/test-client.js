const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Charger le .proto
const PROTO_PATH = path.join(__dirname, '../proto/commande.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const commandeProto = grpc.loadPackageDefinition(packageDefinition).commande;

// Créer un client gRPC connecté à pharma-service
const client = new commandeProto.CommandeService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Tester une commande confirmée
client.ConfirmerCommande({ orderId: "12345" }, (err, response) => {
  if (err) {
    console.error("❌ Erreur :", err);
  } else {
    console.log("✅ Réponse (confirmée) :", response);
  }
});

// Tester une commande rejetée
client.RejeterCommande({ orderId: "67890" }, (err, response) => {
  if (err) {
    console.error("❌ Erreur :", err);
  } else {
    console.log("❌ Réponse (rejetée) :", response);
  }
});
