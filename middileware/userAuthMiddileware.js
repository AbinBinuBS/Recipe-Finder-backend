import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/userModel.js';

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_PRIVATE_KEY;

const userAuthMiddleware = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized, token is missing" });
	}

	try {
		const decoded = jwt.verify(token, accessTokenSecret);
		const user = await User.findOne({email:decoded.email})
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		req.user = user;
		next();
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ message: "Unauthorized, invalid or expired token" });
		}
		return res.status(401).json({ message: "Unauthorized, invalid token" });
	}
};

export default userAuthMiddleware;
