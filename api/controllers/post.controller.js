import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'you are not allowed to create a post'));
	}
	if (!req.body.title || !req.body.content) {
		return next(errorHandler(400, 'Please provide all required fields'));
	}
	const slug = req.body.title
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, '');

	const newPost = new Post({
		...req.body,
		slug,
		userId: req.user.id
	});

	try {
		const savePost = await newPost.save();
		res.status(201).json(savePost);
	} catch (err) {
		next(err);
	}
};

export const getposts = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.order === 'asc' ? 1 : -1;

		// Dynamically build query
		const query = {};

		if (req.query.userId) query.userId = req.query.userId;
		if (req.query.category) query.category = req.query.category;
		if (req.query.slug) query.slug = req.query.slug;
		if (req.query.postId) query._id = req.query.postId;
		if (req.query.searchTerm) {
			query.$or = [
				{ title: { $regex: req.query.searchTerm, $options: 'i' } },
				{ content: { $regex: req.query.searchTerm, $options: 'i' } }
			];
		}


		// Fetch posts with dynamic query
		const posts = await Post.find(query)
			.sort({ updatedAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		const totalPosts = await Post.countDocuments();
		const now = new Date();
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

		const lastMonthPost = await Post.countDocuments({
			createdAt: { $gte: oneMonthAgo }
		});

		res.status(200).json({
			posts,
			totalPosts,
			lastMonthPost
		});
	} catch (err) {
		next(err);
	}
};
