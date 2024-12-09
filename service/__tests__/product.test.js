const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const productService = require('../product/product.service');
const Product = require("../../models/Product");

// Mock du modele Product
jest.mock("../../models/Product",()=>{
  const originalProduct = jest.requireActual("../../models/Product");
  return{
    ...originalProduct,
    insertMany : jest.fn(),
    findById: (id) => {
      // Simulation d’une requête en base de données
      const mockDatabase = {
        1: { id: 1, name: 'Laptop', price: 1000 },
        2: { id: 2, name: 'Phone', price: 500 },
      };
      return Promise.resolve(mockDatabase[id] || null);
    },
  }
});

let mongoServer;
// Bouchon pour la session accessible aux differents describes
let session;
// // 1. Initialisation de MongoMemoryServer et connexion à la base de données avant tous les tests
// beforeAll(async () => {
 
//   try{
//     console.log('Préparation de la creation de serveur Memory')
//     mongoServer = await MongoMemoryServer.create();
//     console.log('MongoMemoryServer créé avec succès')
//   }catch(err){
//     console.error('Erreur lors de la création de MongoMemoryServer:', err);
//     throw new Error('Impossible de créer MongoMemoryServer');   
//   }
//   let uri = mongoServer.getUri();
//   console.log("uri sans replicaSets : ", uri);

  
// // 2.1 Connection a mongoDB via mongoose
//   try {
//     await mongoose.connect(uri);
//     console.log("etat conncection beforeAll: ",mongoose.connection.readyState)

//   }catch(err){
//     console.error('Erreur lors de la connexion à MongoDB:', err);
//     throw new Error('Echec de la configuration du replicaSet');
//   }
   
// });


// // 3. Déconnexion de Mongoose et arrêt de MongoMemoryServer après tous les tests
// afterAll(async () => {
//   // await mongoose.disconnect();
//   await mongoose.connection.close();
//   console.log("etat conncection apres close: ",mongoose.connection.readyState)
//   await mongoServer.stop();
// });



// ################################
// Tests d'insertion de produit
describe("Insertion product test", () => {
  // Bouchons pour mes parametres
  const mockProduct = [{
    name: 'Laptop',
    price: 1500,
    stock: 30,
  }];
  

  
  beforeEach(() => {
    jest.restoreAllMocks();
    // Spy sur insertProducts
    jest.spyOn(productService,"insertProducts");
  });

  afterEach( () => {
    jest.clearAllMocks();
  });

  it('should create a product successfully', async () => {
    Product.insertMany.mockResolvedValue(mockProduct);
    const createdProduct = await productService.insertProducts(mockProduct, session);
    expect(createdProduct).toBeDefined();
    expect(productService.insertProducts).toHaveBeenCalledTimes(1);
    expect(Product.insertMany).toHaveBeenCalledTimes(1);
    expect(Product.insertMany).toHaveBeenCalledWith(
      [{
        name: 'Laptop',
        price: 1500,
        stock: 30,
      }],
      null
    );
    expect(createdProduct).toEqual([{
      name: 'Laptop',
      price: 1500,
      stock: 30,
    }])
  });

  it("Should return error message : empty product", async ()=>{
    Product.insertMany.mockRejectedValue(new Error("No object Found"))
    // const createdProduct = await productService.insertProducts([], session);
    await expect(productService.insertProducts([], session)).rejects.toThrow("Erreur d'insertion des produits : No object Found")
  })

  it("should return error " , async () => {
    Product.insertMany.mockRejectedValue(new Error("Error factice"));
    // const createdProduct = await productService.insertProducts(mockProduct, session);

    await expect(productService.insertProducts(mockProduct, session)).rejects.toThrow("Erreur d'insertion des produits : Error factice")
  })
});

describe("Test de findProduct", () =>{
  // const product = await productService.findProduct(1,session)
  // console.log("test Model" , Product.findById);
  it("Should return correct product",async()=>{
    await expect(productService.findProduct(1,session)).resolves.toEqual({id: 1, name: 'Laptop', price: 1000});
    await expect(productService.findProduct(2,session)).resolves.toEqual({id: 2, name: 'Phone', price: 500});

  })

})

