/* app.js */

const express = require("express");             // inclus le module express de node
const helmet = require("helmet");               // inclus le module helmet de node 
const mongoose = require("mongoose");           // inclus le module mongoose de node pour utiliser mongoDB Atlas
const path = require("path");                   // pour accéder au fichiers sur notre server
const sauceRoutes = require("./routes/sauce");  // importe les routes pour les sauces
const userRoutes = require("./routes/user");    // importe les routes pour l'utilisateur
const dotenv = require('dotenv');               // pour gérer des variables d'environnement

dotenv.config();

// console.log("key = "+ process.env.USER_KEY);

/* connection au cluster mongodb atlas */
mongoose.connect(process.env.USER_KEY,     // normalement on laise pas en clair la clé et le mp ici....
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* passe un handle à notre module pour pouvoir l'utiliser */
const app = express();

/* use helmet */
// app.use(helmet());
app.use(helmet.noSniff());    // mitigates MIME type sniffing X-Content-Type-Options: nosniff
app.use(helmet.xssFilter());  // disable browsers' buggy cross-site scripting filter X-XSS-PROTECTION:0 (Header set to 0) 



/* Gère les problèmes de Cross Origin <> le server du front :4200 et celui du back :3000 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* Pour pouvoir utiliser JSON */
app.use(express.json());  // pourquoi on utilise pas juste JSON.parse/stringify ?

// app.use((req, res) => {
//     res.json({message: "requête bien recue :)"});
// });

app.use('/images', express.static(path.join(__dirname, "images"))); // route pour les images

app.use("/api/sauces", sauceRoutes);                                // route pour les sauces
app.use("/api/auth", userRoutes);                                   // route pour les users

module.exports = app; 