import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModels.js";
dotenv.config();

// const tokenBlacklist = new Set(); // Store blacklisted tokens

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded.id;

        const userExists = await User.findById(decoded.id);
        if (!userExists) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.userExists = {id: userExists._id, email: userExists.email, role: userExists.role};
          
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

const authorization = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userExists.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
        }
        next();
    };
}

export { generateToken, authenticateUser, authorization };