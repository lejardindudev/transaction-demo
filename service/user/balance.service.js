const updateUserBalance = async ( user,newOrder,session ) => {
   try{
        const options = session? {session} : null; 
        // console.log("!!!newOrder sent to balance : ",newOrder)
        if(newOrder[0].amount<0){
            throw new Error("Unable to decrement balance with negative amount");
        }else if(newOrder[0].userId !== user[0]._id){
            throw new Error("UserId conflict :order should come from same user, ");

        }
        user[0].balance -= newOrder[0].amount;
        await user[0].save(options);
        return {status : "success" , message : "user : " + user[0].name + ", balance updated to "+ user[0].balance};
   }catch(err){
        // console.error(err);
        // return err.message;
        // const newError = new Error(err);
        // newError.stack = err.stack;
        // throw newError;
        throw err;
   }
} 


module.exports = {
    updateUserBalance
}

// Cas d'erreur a tester
/**
 * Le message retourné en cas de succes est conforme aux attentes
 * Le message retourner en cas d'error est conforme aux attentes
 * L'id d'user ne correspond pas a l'userId de l'order
 * entrees invalides (user.balance / order.amount)
 * parametres absents (user, newOrder,session)
 * la session est correctement passée au save
 * Le save echoue
 * 
 */