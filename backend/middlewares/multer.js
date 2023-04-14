const multer = require('multer');

const mimeTypes = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/png": "png"
}

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        var name = file.originalname.replace(" ", "_");
        var ext = mimeTypes[file.mimetype];
        callback(null, `${name}_${Date.now()}.${ext}`)
    }
})

module.exports = multer({storage}).single("image");