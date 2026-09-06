const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Protected Routes token base
const requireSignin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Invalid or expired JWT"
        });
    }
};

// Admin access
const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user || user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access"
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error in admin middleware",
            error: error.message
        });
    }
};

module.exports = { requireSignin, isAdmin };