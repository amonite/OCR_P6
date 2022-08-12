/* sauce.js */
const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");



router.post("/", auth, multer, sauceCtrl.createSauce);      // "/api/sauces"            post a new sauce in the array               CREATE
router.get("/", auth, sauceCtrl.getAllSauces);              // "/api/sauces"            get all sauces in an array                  READ    
router.get("/:id", auth, sauceCtrl.getOneSauce);            // "/api/sauces/:id"        get one particular sauce within the array
router.put("/:id", auth, multer, sauceCtrl.updateSauce);    // "/api/sauces/:id"        update one particular sauce ...             UPDATE
router.delete("/:id", auth, sauceCtrl.killSauce);           // "/api/sauces/:id"        delete one particular sauce ...             DELETE

router.post("/:id/like", auth, sauceCtrl.likeSauce);        // "/api/sauces/:id/like"   like one particular sauce                   ?

module.exports = router;