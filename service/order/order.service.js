const Order = require ("../../models/Order");

const createOrder = async (product,user,session) => {
    try{
       
        const options = session? {session} : null; 
        if(!product){
            throw new Error("Unable to create order without product");
        }else if(!user[0]){
            throw new Error("Unable to create order without user");
        }else{
            // Entrées invalides
            if(!user[0]._id){
                throw new Error("invalid entries with user id");
            }else if(!product.price){
                throw new Error("invalid entries with product price");
            }else{
                // Type d'entrées et valeurs limites
                // .. todo in a best world
                const newOrder = await Order.create(
                    [ {
                         orderNumber : "Order-"+ user[0]._id,
                         amount: product.price,
                         userId: user[0]._id
                     }],
                     options
                 )      
                //  console.log("from orderServ",newOrder[0])   
                return newOrder;
            }
        }
    }catch(err){
        // console.error(err);
        return err.message
        
    }

}
// Cas erreur
        // 1. Le create renvoie un reject => catch
        // 2. Le service n'a pas bien transformé les données avant de les passer au create (inutile dans cet exemple)
        // 3. Donnees d'entrées vide (product / user)
        // 4. données invalides (pas de price sur product ou pas d'id sur user)

module.exports = {
    createOrder,
}