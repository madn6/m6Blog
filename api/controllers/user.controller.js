import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const test = (req, res) => {
	res.json({ message: 'api is working' });
};

export const updateUser = async (req, res, next) => {
	if (req.user.id != req.params.userId) {
		return next(errorHandler(403, 'you are not allowed to update this user '));
	}
	if (req.body.password) {
		if (req.body.password.length < 6) {
			return next(errorHandler(400, 'password must be at least 6 charactor'));
		}
		req.body.password = bcryptjs.hashSync(req.body.password, 10);
	}
	if (req.body.username) {
		if (req.body.username.length < 7 || req.body.username.length > 20) {
			return next(errorHandler(400, 'username must be 7 and 20 '));
		}
		if (req.body.username.includes(' ')) {
			return next(errorHandler(400, 'username cannot contain spaces'));
		}

		if (req.body.username !== req.body.username.toLowerCase()) {
			return next(errorHandler(400, 'username must be lowercase'));
		}
		if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
			return next(errorHandler(400, 'username can only contain letters and numbers'));
		}
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.userId,
			{
				$set: {
					username: req.body.username,
					email: req.body.email,
					profilePicture: req.body.profilePicture,
					password: req.body.password
				}
			},
			{ new: true }
		);
		const { password, ...rest } = updatedUser._doc;
		res.status(200).json(rest);
	} catch (err) {
		next(err);
	}
};

import axios from 'axios';

const revokeGoogleToken = async (token) => {
	try {
		const response = await axios.post(`https://oauth2.googleapis.com/revoke?token=${token}`, null, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
		console.log('Google OAuth token revoked:', response.data);
	} catch (err) {
		console.error('Failed to revoke Google OAuth token:', err.message);
	}
};

export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'You are not allowed to delete this user'));
	}

	try {
		// Revoke the OAuth token
		if (req.user.token) {
			await revokeGoogleToken(req.user.token);
		}

		// Delete user from the database
		await User.findByIdAndDelete(req.params.userId);

		res.status(200).json({ message: 'User has been deleted and token revoked' });
	} catch (err) {
		next(err);
	}
};

export const signOut = (req, res, next) => {
	try {
		res.clearCookie('access_token').status(200).json('user has been signed out');
	} catch (err) {
		next(err);
	}
};

export const getUsers = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'You are not allowed to see all users'));
	}
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.sort === 'asc' ? 1 : -1;

		const users = await User.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		const userWithoutPassword = users.map((user) => {
			const { password, ...rest } = user._doc;
			return rest;
		});

		const totalUsers = await User.countDocuments();
		const now = new Date();
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
		const lastMonthUsers = await User.countDocuments({
			createdAt: { $gte: oneMonthAgo }
		});

		res.status(200).json({
			users: userWithoutPassword,
			totalUsers,
			lastMonthUsers
		});
	} catch (err) {
		next(err);
	}
};
