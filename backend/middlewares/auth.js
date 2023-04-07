const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        if (!req.headers["Authorization"]) {
            return res.status(401).json({
                "error": "unauthenticated"
            })
        }

        let token = req.headers["Authorization"].split(" ")[1];
        if (!token) {
            return res.status(401).json({
                "error": "unauthenticated"
            })
        }

        req.auth = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        return res.status(401).json({
            "error": error
        })
    }
}


module.exports = authMiddleware