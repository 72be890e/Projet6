const Sauce = require("../models/sauce");
const fs = require("fs")

const Actions = {
    Liked: 1,
    Canceled: 0,
    Disliked: -1,
}

// Helper function related to the likeSauce function
async function handleLike(userId, sauceId, sauce) {
    if (sauce.usersLiked.includes(userId)) {
        return Sauce.updateOne({
            _id: sauceId
        }, {
            $inc: {
                likes: -1,
            },
            $pull: {
                usersLiked: userId
            }
        })
    }
    if (sauce.usersDisliked.includes(userId)) {
        return Sauce.updateOne({
            _id: sauceId
        }, {
            $inc: {
                dislikes: -1,
                likes: 1
            },
            $push: {
                usersLiked: userId
            },
            $pull: {
                usersDisliked: userId
            }
        })
    }
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
async function handleDislike(userId, sauceId, sauce) {
    if (sauce.usersDisliked.includes(userId)) {
        return Sauce.updateOne({
            _id: sauceId
        }, {
            $inc: {
                dislikes: -1,
            },
            $pull: {
                usersDisliked: userId
            }
        })
    }
    if (sauce.usersLiked.includes(userId)) {
        return Sauce.updateOne({
            _id: sauceId
        }, {
            $inc: {
                dislikes: 1,
                likes: -1
            },
            $push: {
                usersDisliked: userId
            },
            $pull: {
                usersLiked: userId
            }
        })
    }
    return Sauce.updateOne({
        _id: sauceId
    }, {
        $inc: {
            dislikes: 1
        },
        $push: {
            usersDisliked: userId
        },
    })
}


const newSauce = async (req, res) => {
    try {
        const sauceObj = JSON.parse(req.body.sauce);
        delete sauceObj._id;
        const sauce = new Sauce({
            ...sauceObj,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
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
        var sauce = await Sauce.findOne({
            _id: req.params.id
        })
        if (!sauce) {
            // didnt found sauce
            return res.status(404).json({
                error: "Cette sauce n'existe pas"
            })
        }
        res.status(200).json(sauce);
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

const deleteSauce = async (req, res) => {
    try {
        var sauce = await Sauce.findOne({
            _id: req.params.id
        })
        if (!sauce) {
            // didnt found sauce
            return res.status(404).json({
                error: "Cette sauce n'existe pas"
            })
        }
        // Logged in user is the sauce uploader
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({
                error: "Pas authorisé"
            });
        }

        // delete image
        let path = "images/" + sauce.imageUrl.split("/images/")[1]
        fs.unlink(path, async () => {
            try {
                await Sauce.deleteOne({
                    _id: req.params.id
                })
                return res.status(200).json({
                    message: 'Objet supprimé !'
                });
            } catch (error) {
                res.status(400).json({
                    error
                });
            }
        })
    } catch (error) {
        console.log("[ERROR] deleteSauce => ",error)
        res.status(400).json({
            error
        });
    }
}

const updateSauce = async (req, res) => {
    try {
        var oldSauce = req.file ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : {
            ...req.body
        };

        var sauce = await Sauce.findOne({
            _id: req.params.id
        })
        if (!sauce) {
            // didnt found sauce
            return res.status(404).json({
                error: "Cette sauce n'existe pas"
            })
        }

        // Logged in user is the sauce uploader
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({
                message: "Pas authorisé"
            });
        }

        await Sauce.updateOne({ _id: req.params.id}, { ...oldSauce, _id: req.params.id});
        res.status(200).json({message:"Sauce mise a jour"});
    } catch (error) {
        res.status(400).json({
            error
        });
    }
}

const likeSauce = async (req, res) => {
    try {
        const {
            like,
            userId
        } = req.body

        //TODO:  regular like behavior
        var sauce = await Sauce.findOne({
            _id: req.params.id
        })
        if (!sauce) {
            // didnt found sauce
            return res.status(404).json({
                error: "Cette sauce n'existe pas"
            })
        }

        switch (like) {
            case Actions.Liked:
                await handleLike(userId, req.params.id, sauce);
                return res.status(200).json({
                    message: "Sauce likée"
                })
            case Actions.Disliked:
                await handleDislike(userId, req.params.id, sauce);
                return res.status(200).json({
                    message: "Sauce dislikée"
                })
            case Actions.Canceled:
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