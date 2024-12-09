const mongoose = require('mongoose');

// Importation des services
const {findOrCreateUser} = require("../service/user/user.service");
const {updateUserBalance} = require("../service/user/balance.service");


const {findProduct,insertProducts} = require ("../service/product/product.service");
const {decrementStock,updateAllStocks} = require ("../service/product/stock.service");


const {createOrder} = require("../service/order/order.service");
const {findOrCreateInvoice} = require("../service/invoice/invoice.service");
// Gestion objectId
const { ObjectId } = mongoose.Types;


const executeTransaction = async (userMail,userName,productId,session = null) => {
    // console.log('Session dans executeTransaction:', !!session);
    // ######  SI besoin ################
    const productsArray = [
        {
            name:"Doonut",
            price:2.5,
            stock:20
        }
    ]
    // --> insertion produits   
    // const products = insertProducts(productsArray,session);
    // --> reset stock
    // const updatesStock = updateAllStocks(20,session);
    // ############################

    // Rechercher ou crééer le user
    const user = await findOrCreateUser(userMail,userName,session);
    // console.log('- user created : ', user)
    

    
    // Chercher le produit et updater le stock
    const findProductAndUpdateStock = async (productId,session) => {
        // console.log('Session dans findProductAndUpdateStock:', !!session);
        const product = await findProduct(productId,session);
        const productUpdated = await decrementStock(product,session);
        return productUpdated;
    }
    const product = await findProductAndUpdateStock(productId,session);
    console.log('- product Found :',product)

    // Creer la commande
    const newOrder = await createOrder(product,user,session);
    console.log('- order created : ',newOrder)

    // Updater la balance
    await updateUserBalance(user,newOrder,session);
    console.log(`- ${user[0].name}'s balance updated`)

    // Chercher ou créer la facture
    const invoice = await findOrCreateInvoice(newOrder,user,session);
    // console.log(`- ${user[0].name}'s Invoice updated`)

    return {user,product,newOrder,invoice};
}

module.exports = {
    executeTransaction
}