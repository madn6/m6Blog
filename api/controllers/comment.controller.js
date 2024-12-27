import Comment from '../models/comment.model.js';

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
		res.status(200).json(comments)
	} catch (err) {
		next(err);
	}
};
