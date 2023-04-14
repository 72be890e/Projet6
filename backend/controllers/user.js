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
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(401).json({
                error: "utilisateur inconnu"
            });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({
                error: "mot de passe incorrect"
            });
        }

        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });
        
        res.status(200).json({
            userId: user._id,
            token
        });
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