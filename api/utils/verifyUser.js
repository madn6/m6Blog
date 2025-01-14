import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
	const token = req.cookies.access_token;
	if (!token) {
		console.error('No token found in cookies');
		return next(errorHandler(401, 'Unauthorized'));
	}

	jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
		if (err) {
			console.error('Token verification failed:', err.message);
			return next(errorHandler(401, 'Unauthorized'));
		}

		console.log('Decoded user from token:', user); // Debugging
		req.user = user;
		next();
	});
};
