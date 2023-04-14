const express = require("express");
const router = express.Router()
const authMiddleware = require("../middlewares/auth")
const controller = require("../controllers/sauce")
const multerMiddleware = require("../middlewares/multer");


router.use(authMiddleware)
router.get("/", controller.getAllSauces)
router.post("/", multerMiddleware, controller.newSauce)
router.get("/:id", controller.getSingleSauce)
router.put("/:id", multerMiddleware, controller.updateSauce)
router.delete("/:id", controller.deleteSauce)
router.post("/:id/like", controller.likeSauce)


module.exports = router