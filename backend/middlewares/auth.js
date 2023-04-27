const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {

        let token = req.headers["authorization"].split(" ")[1];

        req.auth = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        console.log("[ERROR] auth ->", error, req.method)
        return res.status(401).json({
            "error": error
        })
    }
}


module.exports = authMiddleware