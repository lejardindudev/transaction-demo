const Product = require("../../models/Product");


const findProduct = async (productId,session) => {
    const options = session? {session} : null; 

    // console.log('Options pour findProduct:', { session });
    let product = await Product.findById(
        productId,
        null,
        options            
    );
    
    return product;
}

// Insertion de produits
async function insertProducts(productsArray,session){
    try{
        // formatte la session en objet pour mongoose si elle n'est pas null 
        const options = session? {session} : null; 
        // Code de traitement
        const products = await Product.insertMany(
            productsArray,
            options //si sessiion est définie (prod) c'est un objet sinon c'est la valeur null
        )
        return products; // Renvoyer les produits créés après le commit
    }catch(err){
        throw new Error(`Erreur d'insertion des produits : ${err.message}`);
    }
    
}



module.exports = {
    findProduct,
    insertProducts,
    
}

