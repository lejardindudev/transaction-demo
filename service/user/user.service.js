const User = require("../../models/User");

// Chercher ou creer user
const findOrCreateUser = async (userMail,userName,session) => {
    try{
        const options = session? {session} : null; 
        const result = {
            message:"",
        }
        let user = await User.findOne(
            {
                email:userMail,
                name:userName
            }, 
            null,
            {session}
            )
           
        // Création user
        if(!user){
            user = await User.create(
                [{
                    name: userName,
                    email: userMail,
                    balance : 2000,
    
                }],
                options
            );
            result.message = "User succesfully created";

        }else{
            result.message = "User succesfully found";
            user = [user];
        }
        return  user;

    }catch(err){
        err.customMessage = "Internal Error";
        
        throw err;
    }
}




/**
 * Cas d'erreurs:
 * user mail, username emptty => a trairter dans le controlleur
 * User.findOne plante => catch
 * User.create plante => catch
 * 
 */


module.exports = {
    findOrCreateUser,
}