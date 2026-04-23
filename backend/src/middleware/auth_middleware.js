const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

exports.protect = async (req, res, next) => {
    console.log('[ProtectMiddleware] Request arrived');
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

        console.log('[ProtectMiddleware] Verifying token...');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('[ProtectMiddleware] Token decoded:', decoded);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        return next();

    } catch (error) {
        console.error('[ProtectMiddleware Error]', error.message);
        return res.status(401).json({
            message: "Not authorized, token invalid"
        });
    }
};
exports.adminOnly = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
            return next()
        }
        else {
            res.status(401).json({
                message: "Error in access. You are not the admin!"
            })
        }

    } catch (error) {
        res.status(401).json({
            message: " error while decoding the token"
        })
    }
}