const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require('jsonwebtoken');

const userSignup = async (req, res) => {
    console.log(req.body)
    var {
        password,
        email
    } = req.body;

    try {
        let hashedPassword = await bcrypt.hash(password, 10)
        let user = new User({
            email,
            password: hashedPassword,
        })

        user.save()
            .then(() => {
                res.status(201).json({
                    message: "Utilisateur créé"
                })
            })
    } catch (error) {
        console.log("user.signup => error occured:", error.message)

        res.status(500).json({
            error
        })
    }
}

const userLogin = async (req, res) => {
    var {
        password,
        email
    } = req.body;

    try {
        User.findOne({
                email
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).json({
                        error: "utilisateur inconnu"
                    })
                }

                bcrypt.compare(password, user.password)
                    .then((valid) => {
                        if (!valid) return res.status(401).json({
                            error: "mot de passe incorrect"
                        })

                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign({
                                userId: user._id
                            }, process.env.JWT_SECRET, {
                                expiresIn: "24h"
                            })
                        })
                    }).catch((error) => {
                        console.log("user.login => bcrypt compare:", error)
                        return res.status(500).json({
                            error
                        })
                    });
            }).catch((error) => {
                console.log("user.login => database find:", error)
                return res.status(500).json({
                    error
                })
            })
    } catch (error) {
        console.log("user.signup => error occured:", error.message)

        res.status(500).json({
            error
        })
    }
}

module.exports = {
    userSignup,
    userLogin
}