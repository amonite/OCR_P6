/* sauce.js */
const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const sauceCtrl = require("../controllers/sauce");

// ne pas oublier de rajouter le middleware auth pout l'accès aux routes 
// ex: router.post("/", auth, sauceCtrl.createSauce);


router.post("/", sauceCtrl.createSauce);   // "/api/sauces"        post a new sauce in the array               CREATE
router.get("/", sauceCtrl.getAllSauces);   // "/api/sauces"        get all sauces in an array                  READ    
router.get("/:id", sauceCtrl.getOneSauce); // "/api/sauces/:id"    get one particular sauce within the array
router.put("/:id", sauceCtrl.updateSauce); // "/api/sauces/:id"    update one particular sauce ...             UPDATE
router.delete("/:id", sauceCtrl.killSauce);// "/api/sauces/:id"    delete one particular sauce ...             DELETE

module.exports = router;