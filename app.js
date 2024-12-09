const mongoose = require('mongoose');
const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Invoice = require("./models/Invoice");
const {executeTransaction,createOrderAndUpdateBalance,findorCreateInvoice} = require("./controllers/transaction.controllers");

// Gestion objectId
const { ObjectId } = mongoose.Types;


// URL du replicaSets adapter les ports au besoin
const mongoUri = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/transactions-demo?replicaSet=rs0";



//   Connexion a mongoDB
async function connectMongoDb() {
    try{
        console.log("connection replicaSet OK");
        await mongoose.connect(mongoUri);
        
    }catch (error) {
        console.log("Échec de la connexion à MongoDB'", error)
    }
}




async function main(){
    await connectMongoDb();
    // Créer une session pour gérer la transaction
    
    // post variables
    const userMail = "simonelapoule@bobo.com"; 
    const userName = "forca";
    const productId = new ObjectId("670511c567da694c6cc79df4");
    // Laptop       670511c567da694c6cc79df4
    // UC           670511c567da694c6cc79df5
    // WideScreen   670511c567da694c6cc79df6
    // Desk         670511c567da694c6cc79df7
    const session = await mongoose.startSession();

    try{
// Démarrer une transaction
        session.startTransaction();
        console.log('Session initialisée dans app.js:', !!session);

// Lancer la transaction
        const transaction = await executeTransaction(userMail,userName,productId,session);

// Valider la transaction
        await session.commitTransaction();
        console.log('La transaction s\'est déroulée avec succcès')
    }catch (error){
// Annuler la transaction en cas d'erreur
        await session.abortTransaction();
        console.error('Transaction annulée :', error);
    }finally{
        session.endSession();
    }
}

// Execution du programme

// if (process.env.NODE_ENV !== 'test') {
//     main();  // Ne pas exécuter `main` en mode test
// }

main();

module.exports = {
    connectMongoDb
}