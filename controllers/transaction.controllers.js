const mongoose = require('mongoose');

// Importation des services
const userService = require("../service/user/user.service");
const balanceService = require("../service/user/balance.service");


const productService = require ("../service/product/product.service");
const stockService = require ("../service/product/stock.service");


const orderService = require("../service/order/order.service");
const invoiceService = require("../service/invoice/invoice.service");
// Gestion objectId
const { ObjectId } = mongoose.Types;


const executeTransaction = async (userMail,userName,productId,session = null) => {
   
    const productsArray = [
        {
            name:"Doonut",
            price:2.5,
            stock:20
        }
    ]
    // --> insertion produits   
    // const products = productService.insertProducts(productsArray,session);
    // --> reset stock
    // const updatesStock = stockService.updateAllStocks(20,session);
    // ############################

    // Rechercher ou crééer le user
    const user = await userService.findOrCreateUser(userMail,userName,session);
    // console.log('- user created : ', user)
    

    
    // Chercher le produit et updater le stock
    const findProductAndUpdateStock = async (productId,session) => {
        // console.log('Session dans findProductAndUpdateStock:', !!session);
        const product = await productService.findProduct(productId,session);
        const productUpdated = await stockService.decrementStock(product,session);
        return productUpdated;
    }
    const product = await findProductAndUpdateStock(productId,session);
    // console.log('- product Found :',product)

    // Creer la commande
    const newOrder = await orderService.createOrder(product,user,session);
    // console.log('- order created : ',newOrder)

    // Updater la balance
    await balanceService.updateUserBalance(user,newOrder,session);
    // console.log(`- ${user[0].name}'s balance updated`)

    // Chercher ou créer la facture
    // console.log("user :", user);
    // console.log("newOrder :", newOrder);

    // console.log("Avant appel à findOrCreateInvoice");
    const invoice = await invoiceService.findOrCreateInvoice(newOrder,user,session);
    // console.log(`- ${user[0].name}'s Invoice updated`)
    // console.log("Après appel à findOrCreateInvoice :", invoice);
    return {user,product,newOrder,invoice};
}

module.exports = {
    executeTransaction
}