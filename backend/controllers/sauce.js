/* sauce.js */

const Sauce = require("../models/Sauce");

exports.createSauce = (req, res, next) =>{
    const sauce = new Sauce({
        //sauce: req.body.sauce,
        //image: req.body.image
    });
    sauce.save().then(
        () => { res.status(201).json({message:"sauce created !"}); }
    ).catch( error => { res.status(400).json({error: error});});
};

exports.getAllSauces = (req, res, next) =>{
    Sauce.find().then(
        sauces =>{ res.status(200).json(sauces);}
    ).catch( error =>{ res.status(400).json({error: error});});
};

exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({
        _id: req.params.id
    }).then(sauce =>{ res.status(200).json(sauce);}
    ).catch(error =>{ res.status(400).json({error: error});});
};

exports.updateSauce = (req, res, next) =>{
    const sauce = new Sauce({
        // get sauce object here 
        // ....
        // ....
    });
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () =>{ res.status(200).json({message: "sauce updated !"});}
    ).catch(error =>{ res.status(400).json({error: error});});
};

exports.killSauce = (req, res, next) =>{
    Sauce.deleteOne({_id: req.params.id}).then(
        () =>{ res.status(200).json({message: "sauce deleted !"});}
    ).catch(error =>{ res.status(400).json({error:error});});
};