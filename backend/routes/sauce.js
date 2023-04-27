const express = require("express");
const router = express.Router()
const authMiddleware = require("../middlewares/auth")
const controller = require("../controllers/sauce")
const multerMiddleware = require("../middlewares/multer");

//router.use(authMiddleware)
router.get("/", controller.getAllSauces)
router.post("/", authMiddleware, multerMiddleware, controller.newSauce)
router.get("/:id", controller.getSingleSauce)
router.put("/:id", authMiddleware, multerMiddleware, controller.updateSauce)
router.delete("/:id", authMiddleware, controller.deleteSauce)
router.post("/:id/like", authMiddleware, controller.likeSauce)


module.exports = router