const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            UserID: user.UserID,
            role: user.Role
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_SECRET_EXPIRED }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
