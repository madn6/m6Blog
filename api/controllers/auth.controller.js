import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
	// Cookie options based on environment
	const { username, email, password } = req.body;

	if (!username || !email || !password || username === '' || email === '' || password === '') {
		next(errorHandler(400, 'all fields are required'));
	}

	const hashedPassword = bcryptjs.hashSync(password, 10);

	const newUser = new User({
		username,
		email,
		password: hashedPassword
	});

	try {
		await newUser.save();
		res.json('signup successfull');
	} catch (error) {
		next(error);
	}
};

export const signIn = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password || email === '' || password === '') {
		next(errorHandler(400, 'all fields are required'));
	}

	try {
		const validUser = await User.findOne({ email });
		if (!validUser) {
			return next(errorHandler(404, 'user not found'));
		}
		const validPassword = bcryptjs.compareSync(password, validUser.password);
		if (!validPassword) {
			return next(errorHandler(404, 'Invalid password'));
		}

		const token = jwt.sign(
			{ id: validUser._id, isAdmin: validUser.isAdmin },
			process.env.JWT_SECRET_KEY
		);

		const { password: pass, ...rest } = validUser._doc;
		res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
	} catch (err) {
		next(err);
	}
};

export const google = async (req, res, next) => {
	const { email, name, googlePhotoUrl } = req.body;

	try {
		const user = await User.findOne({ email });

		// Generate JWT token without expiration
		const generateToken = (id, isAdmin) =>
			jwt.sign({ id, isAdmin }, process.env.JWT_SECRET_KEY);

		// Cookie options based on environment
		const isProduction = process.env.NODE_ENV === 'production';
		const cookieOptions = {
			httpOnly: true,
			secure: isProduction, // Enable secure only in production
			sameSite: isProduction ? 'None' : 'Lax' // None for cross-origin in production
		};

		if (user) {
			// Existing user
			const token = generateToken(user._id, user.isAdmin);
			const { password, ...rest } = user._doc;
			return res.status(200).cookie('access_token', token, cookieOptions).json(rest);
		} else {
			// New user
			const generatedPassword =
				Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

			const newUser = new User({
				username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
				email,
				password: hashedPassword,
				profilePicture: googlePhotoUrl
			});

			await newUser.save();

			const token = generateToken(newUser._id, newUser.isAdmin);
			const { password, ...rest } = newUser._doc;
			return res.status(200).cookie('access_token', token, cookieOptions).json(rest);
		}
	} catch (err) {
		next(err);
	}
};

