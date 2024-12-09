//INITIALISATION GLOBALE DU FICHIER TEST
const mongoose = require('mongoose'); // Import de Mongoose pour la gestion de la base de données
const { MongoMemoryServer } = require('mongodb-memory-server'); // Import de MongoMemoryServer pour lancer MongoDB en mémoire




let mongoServer; // Variable globale pour stocker l'instance MongoMemoryServer

// 1. Initialisation de MongoMemoryServer et connexion à la base de données avant tous les tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // Créer une nouvelle instance de MongoDB en mémoire
  const uri = mongoServer.getUri(); // Récupérer l'URI pour se connecter à cette instance
  await mongoose.connect(uri);  
  // console.log("État de la connexion Mongoose:", mongoose.connection.readyState);
});

// 2. Nettoyer la base de données après chaque test pour garantir l'indépendance des tests
afterEach(async () => {
  await mongoose.connection.db.dropDatabase(); // Supprimer la base de données après chaque test
});

// 3. Déconnexion de Mongoose et arrêt de MongoMemoryServer après tous les tests
afterAll(async () => {
  await mongoose.disconnect(); // Déconnecter Mongoose de l'instance MongoDB
  await mongoServer.stop(); // Arrêter MongoMemoryServer et libérer les ressources
});

//# Appel aux ressources
//## Appel au controller:
const {executeTransaction } = require("../transaction.controllers");
// ## Appel aux services
const {insertProducts} = require('../../service/product/product.service')
// const {findOrCreateUser} = require("../../service/user/user.service");
// const {updateUserBalance} = require("../../service/user/balance.service");

// const {decrementStock,updateAllStocks} = require ("../../service/product/stock.service");

// const {createOrder} = require("../../service/order/order.service");
// const {findOrCreateInvoice} = require("../../service/invoice/invoice.service");

//# mocks
const mockSession = null;
// {
//     inTransaction: jest.fn(() => true), // Simule une session en transaction
//     startTransaction: jest.fn(),
//     commitTransaction: jest.fn(),
//     abortTransaction: jest.fn(),
//     endSession: jest.fn(),
// };
// Spies sur services
const userService = require("../../service/user/user.service") ;
jest.spyOn(userService,"findOrCreateUser");

const balanceService = require("../../service/user/balance.service");
jest.spyOn(balanceService,"updateUserBalance");

const productService = require("../../service/product/product.service");
jest.spyOn(productService,"findProduct");
jest.spyOn(productService,"insertProducts");

const stockService = require("../../service/product/stock.service");
jest.spyOn(stockService,"decrementStock");
jest.spyOn(stockService,"updateAllStocks");

const orderService = require ("../../service/order/order.service");
jest.spyOn(orderService,"createOrder");

const invoiceService = require ("../../service/invoice/invoice.service");
jest.spyOn(invoiceService,"findOrCreateInvoice");



//# Dérouler les tests du fichier
describe("Test intégration controller", ()=>{
    let testProductId;
    beforeEach(async ()=>{
        const products = await insertProducts([
            {
                name:"Doonut",
                price:2.5,
                stock:20
            },
            {
                name:"Laptop",
                price:2500,
                stock:5
            }

        ],mockSession)
        testProductId = products[0]._id
    })
    it("should provide a fully succesfull transaction process",async()=>{
        // console.log(testProductId);
        await executeTransaction("bob@sponge.com","bobby",testProductId,mockSession);

        // expect(insertProducts).toHaveBeenCalledTimes(1);
        expect(userService.findOrCreateUser).toHaveBeenCalledTimes(1);
        expect(userService.findOrCreateUser).toHaveBeenCalledWith("bob@sponge.com","bobby",null);

        expect(productService.findProduct).toHaveBeenCalledTimes(1);
        expect(productService.findProduct).toHaveBeenCalledWith(testProductId,null);

    })
})


