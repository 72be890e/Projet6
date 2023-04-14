const Sauce = require("../models/sauce");

const Actions = {
    Liked: 1,
    Canceled: 0,
    Disliked: -1,
}

// Helper function related to the likeSauce function
async function handleLike(userId, sauceId) {
    return Sauce.updateOne({
        _id: sauceId
    }, {
        $inc: {
            likes: 1
        },
        $push: {
            usersLiked: userId
        },
    })
}

// Helper function related to the likeSauce function
async function handleDislike(userId, sauceId) {
    return Sauce.updateOne({
        _id: sauceId
    }, {
        $inc: {
            dislikes: 1
        },
        $push: {
            usersLiked: userId
        },
    })
}


const newSauce = async (req, res) => {
    try {
        const sauceObj = JSON.parse(req.body.sauce);
        delete sauceObj._id;
        const sauce = new Sauce({
            ...sauceObj,
            imageUrl: `${req.protocol}://${req.hostname}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
        });

        await sauce.save();
        res.status(201).json({
            message: "Sauce enregistrée !",
        });
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
}

const getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

const getSingleSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findOne({
            _id: req.params.id
        });
        res.status(200).json(sauce);
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

const deleteSauce = async (req, res) => {}
const updateSauce = async (req, res) => {}

const likeSauce = async (req, res) => {
    try {
        const {
            like,
            userId
        } = req.body
        //TODO:  regular like behavior
        switch (like) {
            case Actions.Liked:
                await handleLike(userId, req.params.id);
                return res.status(200).json({
                    message: "Sauce likée"
                })
            case Actions.Disliked:
                await handleDislike(userId, req.params.id);
                return res.status(200).json({
                    message: "Sauce dislikée"
                })
            case Actions.Canceled:
                var sauce = await Sauce.findOne({
                    _id: req.params.id
                })
                if (!sauce) {
                    // didnt found sauce
                    return res.status(404).json({
                        error: "Cette sauce n'existe pas"
                    })
                }
                console.log(sauce)
                // user previously liked the sauce
                if (sauce.usersLiked.includes(userId)) {
                    await Sauce.updateOne({
                        _id: req.params.id
                    }, {
                        // substract a like
                        $inc: {
                            likes: -1
                        },
                        $pull: {
                            usersLiked: userId
                        },
                    })
                    return res.status(200).json({
                        message: "Like annulé"
                    })
                }

                if (sauce.usersDisliked.includes(userId)) {
                    await Sauce.updateOne({
                        _id: req.params.id
                    }, {
                        // substract a dislike
                        $inc: {
                            dislikes: -1
                        },
                        $pull: {
                            usersDisliked: userId
                        },
                    })
                    return res.status(200).json({
                        message: "Dislike annulé"
                    })
                }
                // user has never interacted with this sauce
                return res.status(403).json({
                    error: "L'utilisateur n'a jamais intéragi avec cette sauce"
                })
            default:
                return res.status(403).json({
                    error: "Mauvaise action"
                })
        }
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

module.exports = {
    newSauce,
    getAllSauces,
    getSingleSauce,
    deleteSauce,
    updateSauce,
    likeSauce
}