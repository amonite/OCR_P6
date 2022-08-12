/* auth.js */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    try {
        /* extrait le token du header authorization 
        comme il contient le mot clé Bearer on split après l'espace pour récup juste le token*/
        const token = req.headers.authorization.split(" ")[1];           
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // decode le token pour voir si il est bon
        // prend l'id dans le token et le passe au header de la requête pour pouvoir acceder aux routes 
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    
    next();
    } catch(erro) {
        res.status(401).json({error});
    }

};