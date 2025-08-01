const jwt = require('jsonwebtoken');
const User = require("../models/User");

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization denied"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id).select("-passwordHash");
        if(!req.user) return res.status(404).json({ message: "User not found"});
        next();
    } catch(err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;