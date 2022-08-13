/* sauce.js */

const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce); // parse le corps de la requête pour obtenir un objet utilisable mais d'ou vient le body.sauce ?!
    delete sauceObject._id;                         // mongoDB generated id ?
    delete sauceObject._userId;                     // on préfère utiliser l'id du token mais pourquoi un underscore ?!!
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // pquoi on doit avoir l'url complète pour utiliser l'image ?
        likes: 0,
        dislikes: 0
    });
    sauce.save().then(
        () => { res.status(201).json({message: "sauce created !"}); }
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

exports.killSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce =>{
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: "not authorized !"});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () =>{
                    Sauce.deleteOne({_id: req.params.id}).then(
                        () =>{ res.status(200).json({message: "sauce deleted !"});}
                    ).catch(error =>{ res.status(400).json({error:error});});
                })
            }
        })
        .catch(error => res.status(500).json({error}));
};

exports.updateSauce = (req, res, next) =>{
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),                                                  // pourquoi body.sauce ?!!
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    console.log({...req.body});
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) =>{
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: "not authorized !"});
            }else{
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}).then( //besoin de clarification pquoi on update 2x l'id?
                    () =>{ res.status(200).json({message: "sauce updated !"});}
                ).catch(error =>{ res.status(400).json({error: error});})
            }
    
    })
    .catch(error => res.status(400).json({error}));

};

exports.likeSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})  // recup l'id de la sauce dans l'url 
        .then((sauce) =>{
                //log la requête pour voir son body { userId: "xxxxxxxxxxxxx", like: 1}
                console.log(req.body);
                // récupère le like dans la requête
                const like = Number(req.body.like); 
                console.log( "like = "+ like);

                console.log(sauce);
                Sauce.updateOne({likes: like}).then(
                    () =>{ res.status(200).json({message: "sauce liked or disliked 6 !"});}
                ).catch(error =>{ res.status(400).json({error: error});})
            
    
    })
    .catch(error => res.status(400).json({error}));
}