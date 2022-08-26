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
        // likes: 0,
        // dislikes: 0,
        // usersLiked: [],
        // usersDisliked: []
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
        ...JSON.parse(req.body.sauce),                                                  
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) =>{
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: "not authorized !"});
            }else{
                /* ajout de la suppression des images non utilisées */

                // console.log("sauce.imageUrl = "+sauce.imageUrl);
                const str = sauce.imageUrl;
                const file = str.split("/");
                const fileName = file[4];
                // console.log("filePath = "+ fileName);
                fs.unlink(`images/${fileName}`, () =>{
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}).then( 
                        () =>{ res.status(200).json({message: "sauce updated !"});}
                    ).catch(error =>{ res.status(400).json({error: error});})
                });
            }
    
    })
    .catch(error => res.status(400).json({error}));

};


exports.likeSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})  // recup l'id de la sauce dans l'url 
        
        .then((sauce) =>{
                
                /* récupère le like dans la requête */
                const like = Number(req.body.like); 
            
                /* récupère l'id de l'utilisateur */
                const userId = req.body.userId;
                
                if(like === 1){
                    console.log("like 1 = "+like);
                    Sauce.updateOne({_id:req.params.id},
                        {$inc:{likes: 1}, $push: {usersLiked:userId}}).then(
                            () =>{ res.status(200).json({message: "sauce liked  !"})}
                            ).catch(error =>{ res.status(400).json({error: error});})
                }
                else if(like === 0){
                    console.log("like 0 = "+like);
                    
                    if(sauce.usersLiked.length !==0){
                        for(i=0; i<sauce.usersLiked.length;i++){            // can be optimized with .find(userId) or .includes(userId) or better use a Set() !
                            if(userId == sauce.usersLiked[i]){
                                Sauce.updateOne({_id:req.params.id},
                                    {$inc:{likes: -1}, $pull: {usersLiked:userId}}).then(
                                        () =>{ res.status(200).json({message: "sauce unliked !"})}
                                    ).catch(error =>{ res.status(400).json({error: error});})
                            }
                        }
                    }
                    if(sauce.usersDisliked.length !==0){
                        for(i=0; i<sauce.usersDisliked.length; i++){
                            if(userId == sauce.usersDisliked[i]){
                                Sauce.updateOne({_id:req.params.id},
                                    {$inc:{dislikes: -1}, $pull: {usersDisliked:userId}}).then(
                                        () =>{ res.status(200).json({message:"sauce undisliked !"})}
                                    ).catch(error =>{res.status(400).json({error:error});})
                            }
                        }
                    }
                }
                else if(like === -1){
                    console.log("like -1 = "+like);
                    Sauce.updateOne({_id:req.params.id},
                        {$inc:{dislikes:1}, $push: {usersDisliked:userId}}).then(
                            () =>{res.status(200).json({message:"sauce disliked !"})}
                        ).catch(error =>{ res.status(400).json({error:error});})

                }
                
                // console.log(sauce);       
    
        })
        .catch(error => res.status(400).json({error}));
}


/* old updateSauce function without support for deleting old image file after update of sauce  */

// exports.updateSauce = (req, res, next) =>{
//     const sauceObject = req.file ? {
//         ...JSON.parse(req.body.sauce),                                                  
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     } : { ...req.body};
//     // console.log({...req.body});
//     delete sauceObject._userId;
//     Sauce.findOne({_id: req.params.id})
//         .then((sauce) =>{
//             if(sauce.userId != req.auth.userId){
//                 res.status(401).json({message: "not authorized !"});
//             }else{
//                 Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}).then( 
//                     () =>{ res.status(200).json({message: "sauce updated !"});}
//                 ).catch(error =>{ res.status(400).json({error: error});})
//             }
    
//     })
//     .catch(error => res.status(400).json({error}));

// };
