const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        //  If no token
        if (!token) {
            return res.status(401).json({
                msg: "Not authorized, token missing"
            });
        }

        //  Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        //  Get user from DB
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                msg: "User not found"
            });
        }

        //  Move to next middleware
        return next();

    } catch (error) {
        return res.status(401).json({
            msg: "Not authorized, token invalid"
        });
    }
};
exports.adminOnly = async (req, res,next) => {
    try {
        if(req.user && req.user.role === "admin"){
            return next()
        }
         else {
            res.status(401).json({
                message: "Error in access. You are not the admin!"
            })
        }
        
    } catch (error) {
        res.status(401).json({
            msg:" error while decoding the token"
        })
    }
}