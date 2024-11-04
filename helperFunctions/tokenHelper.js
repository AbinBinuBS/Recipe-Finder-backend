import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const refreshTokenSecret = process.env.REFRESH_TOKEN_PRIVATE_KEY;

export const generateAccessToken = (user) => {
    return jwt.sign(user, accessTokenSecret, { expiresIn: "7h" });
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, refreshTokenSecret, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, accessTokenSecret);
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
};
