const Product = require("../../models/Product");

const decrementStock = async (product,session) => {
    if(!product){
        throw new Error("No product found, please check your entries")
    }else{
        // Update stock
        if(product.stock > 0){
            const options = session? {session} : null; 
            product.stock--;
            await product.save(options);
            
        }else{
            // Erreur pas de stock
            throw new Error("Il n'y a plus de produit en stock")
        }
    }
    return product;
}

const updateAllStocks = async (quantity,session) => {
    const options = session? {session} : null; 
    
    const products = await Product.updateMany(
        {},
        {stock:quantity},
        options
    )
    return {status : "success" , message : "All products were updated"};
}

module.exports = {
    decrementStock,
    updateAllStocks
}