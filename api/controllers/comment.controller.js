import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {
	try {
		const { content, postId, userId } = req.body;
		if (userId !== req.user.id) {
			return next(403, 'you are not allowed to create this comment');
		}
		const newComment = new Comment({
			content,
			postId,
			userId
		});
		await newComment.save();
		res.status(200).json(newComment);
	} catch (err) {
		next(err);
	}
};

export const getPostComments = async (req, res, next) => {
	try {
		const comments = await Comment.find({ postId: req.params.postId }).sort({
			createdAt: -1
		});
		res.status(200).json(comments);
	} catch (err) {
		next(err);
	}
};

export const likeComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			return next(errorHandler(404, 'Comment not found'));
		}
		const userIndex = comment.likes.indexOf(req.user.id);
		if (userIndex === -1) {
			comment.numberOfLikes += 1;
			comment.likes.push(req.user.id);
		} else {
			comment.numberOfLikes -= 1;
			comment.likes.splice(userIndex, 1);
		}
		await comment.save();
		res.status(200).json(comment);
	} catch (err) {
		next(err);
	}
};

export const editComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			return next(errorHandler(404, 'Comment not found'));
		}
		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return next(403, 'you are no allowed to edit this comment');
		}
		if (!req.body.content || req.body.content.trim().length === 0) {
			return next(new Error('Content cannot be empty', { statusCode: 400 }));
		}
		const editedComment = await Comment.findByIdAndUpdate(
			req.params.commentId,
			{
				content: req.body.content
			},
			{ new: true }
		);
		res.status(200).json(editedComment);
	} catch (err) {
		next(err);
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			return next(errorHandler(404, 'Comment not found'));
		}
		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return next(403, 'you are no allowed to delete this comment');
		}
		await Comment.findByIdAndDelete(req.params.commentId);
		res.status(200).json('comment has been deleted');
	} catch (err) {
		next(err);
	}
};

export const getComments = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'You are not allowed to get all comments'));
	}
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.sort === 'desc' ? -1 : 1;

		// Fetch comments with pagination and sorting
		const comments = await Comment.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		// Total comments in the database
		const totalComments = await Comment.countDocuments();

		// Calculate the date one month ago
		const now = new Date();
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(now.getMonth() - 1);

		// Count comments created in the last month
		const lastMonthComments = await Comment.countDocuments({
			createdAt: { $gte: oneMonthAgo }
		});

		// Send the response
		res.status(200).json({ comments, totalComments, lastMonthComments });
	} catch (err) {
		next(err);
	}
};

