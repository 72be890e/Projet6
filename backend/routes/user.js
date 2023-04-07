const express = require("express"); 
const router = express.Router()
const controller = require("../controllers/user")

router.post("/signup",controller.userSignup)
router.post("/login", controller.userLogin)


module.exports = router;