const Invoice = require("../../models/Invoice");

const findOrCreateInvoice = async (newOrder,user,session) => {
    try {
        // console.log("findOrCreateInvoice appelé avec :", user, newOrder);

        const options = session? {session} : null; 
     
        let invoice = await Invoice.findOne({
            userId:user[0]._id
        },
        null,
        options);
        // console.log("Résultat de findOne :", invoice);
    
        // Création Invoice
        
        // Pas d'invoice existant => création
        if(!invoice){
            
            invoice = await Invoice.create(
                [{
                    invoiceNumber : "Inv-"+ user[0]._id.toString(),
                    orders: [newOrder[0]._id] ,
                    totalAmount : newOrder[0].amount ,
                    userId:user[0]._id  
                }],
                options
            )
            // invoice=newInvoice;
            // console.log("@@newInvoice :" , newInvoice);
        }else{
            // console.log("from invoiceServ",newOrder[0])

            invoice.orders.push(newOrder[0]._id);
            invoice.totalAmount += newOrder[0].amount;
            
            await invoice.save(options);
        }
        return {status : "success" , message : "Invoice created or Updated"};
    } catch (err){
        // console.error("!!!!!!Erreur attrapée :", err);
        // return{status:"internalError"};
        throw new Error ("Database connection error")
    }
}


module.exports = {
    findOrCreateInvoice,
}