/* Sauce.js */

const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },       // identifiant unique de mongoDB pour celui qui poste la sauce 
    name: { type: String, required: true },         // nom de la sauce
    manufacturer: { type: String, required: true }, // fabricant de la sauce
    description: { type: String, required: true },  // description de la sauce
    mainPepper: { type: String, required: true },   // principal ingrédient épicé de la sauce
    imageUrl: { type: String, required: true },     // l'url de l'image de la sauce téléchargée par l'utilisateur
    heat: { type: Number, required: true },         // nombre <> 1 et 10 décrivant la sauce 
    likes: { type: Number, required: true },        // nombre d'utilisateurs qui aiment la sauce
    dislikes: { type: Number, require: true },      // nombre d'utilisateurs qui n'aiment pas la sauce
    usersLiked: { type: Array, require: true },     // tableau des identifiants des utilisateurs qui ont aimé la sauce
    usersDisliked: { type: Array, require: true }   // tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
});

module.exports = mongoose.model("Sauce", sauceSchema);