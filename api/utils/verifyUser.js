import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
	const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1]; // Cookie or Header-based token

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		req.user = user;
		next();
	});
};
