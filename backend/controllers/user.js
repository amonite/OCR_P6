/* user.js */
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) =>{
    // password validation goes here ...but the front won't let me send messages !
    // https://www.npmjs.com/package/password-validator
    /* hash du mdp */
    bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: "utilisateur crée !"}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) =>{
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                return res.status(401).json({ message: "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({message: "Mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(            // la methode .sign() de jwt chiffre un token
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET",  // chaîne secrete pour générer le token; à remplacer par une + longue pour la prod !
                            { expiresIn: "24h"}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

/* Le token contient en payload (données encodées ds le token) l'id de l'utilisateur */