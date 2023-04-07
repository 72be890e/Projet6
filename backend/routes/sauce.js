const express = require("express"); 
const router = express.Router()
const authMiddleware = require("../middlewares/auth")
const controller = require("../controllers/sauce")

router.use(authMiddleware)
router.get("/",controller.getSauce)


module.exports = router