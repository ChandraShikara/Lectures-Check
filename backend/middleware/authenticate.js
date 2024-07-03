const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const keysecret = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const verifyToken = jwt.verify(token, keysecret);
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authenticate;
