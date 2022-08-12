/* app.js */

const express = require("express");
const mongoose = require("mongoose");
const sauceRoutes = require("./routes/sauce");  //
const userRoutes = require("./routes/user");    //


mongoose.connect("mongodb+srv://amonite:mongoDB7619@cluster0.7i2ttrf.mongodb.net/?retryWrites=true&w=majority",
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json()); 

app.use((req, res) => {
    res.json({message: "requête bien recue :)"});
});


app.use("/api/sauces", sauceRoutes);    //
app.use("/api/auth", userRoutes);       //

module.exports = app; 