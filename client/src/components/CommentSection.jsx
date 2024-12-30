import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { HiOutlineExclamationCircle, HiX } from 'react-icons/hi';

// eslint-disable-next-line react/prop-types
export default function CommentSection({ postId }) {
	const [comment, setComment] = useState('');
	const [commentError, setCommentError] = useState(null);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [postComment, setPostComment] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [commentToDelete, setCommentToDelete] = useState(null);

	const navigate = useNavigate();

	const { currentUser } = useSelector((state) => state.user);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setComment(value);
		setButtonDisabled(!value.trim());
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (comment.length > 200) {
			return;
		}
		try {
			const res = await fetch('/api/comment/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
			});
			const data = await res.json();
			if (res.ok) {
				setComment('');
				setCommentError(null);
				setPostComment([data, ...postComment]);
			}
		} catch (error) {
			setCommentError(error.message);
		}
	};

	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await fetch(`/api/comment/getPostComments/${postId}`);
				if (res.ok) {
					const data = await res.json();
					setPostComment(data);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		getComments();
	}, [postId]);

	const handleLike = async (commentId) => {
		try {
			if (!currentUser) {
				navigate('/sign-in');
				return;
			}
			const res = await fetch(`/api/comment/likeComment/${commentId}`, {
				method: 'PUT'
			});

			if (res.ok) {
				const data = await res.json();
				setPostComment((prevComments) =>
					prevComments.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									likes: data.likes,
									numberOfLikes: data.likes.length
							  }
							: comment
					)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	console.log(postComment);

	const handleEdit = async (commentToEdit, editedContent) => {
		setPostComment((prevComments) =>
			prevComments.map((cmt) =>
				cmt._id === commentToEdit._id ? { ...cmt, content: editedContent } : cmt
			)
		);
	};

	const handleDelete = async (commentId) => {
		setShowModal(false)
		try {
			if (!currentUser) {
				navigate('/sign-in');
				return;
			}
			const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				await res.json();
				setPostComment(postComment.filter((comment) => comment._id !== commentId));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div>
			<div className="  max-w-md  mx-auto w-full p-3">
				{currentUser ? (
					<div className="flex items-center gap-1 my-5 text-sm ">
						<p className="text-gray-400">Signed in as:</p>
						<img
							className="h-6 w-6 object-cover rounded-full"
							src={currentUser.profilePicture}
							alt={currentUser.username}
						/>
						<Link className=" text-cyan-600 hover:underline" to={'/dashboard?tab=profile'}>
							@{currentUser.username}
						</Link>
					</div>
				) : (
					<div className="text-sm text-teal-500 my-5 flex items-center justify-center gap-2">
						You must be signed in to comment.
						<Link className="text-blue-500 underline" to={'/sign-in'}>
							Sign In
						</Link>
					</div>
				)}
				{currentUser && (
					<form
						onSubmit={handleSubmit}
						className="border max-w-md mx-auto w-full p-3 border-gray-500 rounded-md"
					>
						<Textarea
							onChange={handleInputChange}
							className="h-14 resize-none"
							placeholder="Add a comment..."
							row="3"
							maxLength="200"
							value={comment}
						/>
						<div className="flex items-center justify-between mt-4">
							<p className="dark:text-white text-sm">{200 - comment.length} characters remaining</p>
							<Button disabled={buttonDisabled} type="submit" className="text-sm">
								Submit
							</Button>
						</div>
						{commentError && (
							<Alert color="failure" className="mt-5">
								{commentError}
							</Alert>
						)}
					</form>
				)}
				{postComment.length === 0 ? (
					<p className="text-sm my-5">No Comments yet!</p>
				) : (
					<>
						<div className="text-sm dark:text-gray-400 my-5 flex items-center gap-1">
							<p className="">{postComment.length > 1 ? 'Comments' : 'Comment'}</p>
							<div className=" dark:text-white bg-gray-500 px-2  rounded-sm">
								<p>{postComment.length}</p>
							</div>
						</div>
						{postComment.map((comment) => (
							<Comments
								key={comment._id}
								comment={comment}
								onEdit={handleEdit}
								onLike={handleLike}
								onDelete={(commentId) => {
									setShowModal(true);
									setCommentToDelete(commentId);
								}}
							/>
						))}
					</>
				)}
			</div>
			<Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
				<span
					onClick={() => setShowModal(false)}
					className="flex  items-center justify-end p-2 cursor-pointer"
				>
					<HiX className="hover:scale-110 h-5 w-5 transition-all duration-150" />
				</span>
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
						<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this comment?
						</h3>
						<div className="flex justify-center  gap-4">
							<Button color="failure" onClick={() => handleDelete(commentToDelete)}>
								{"Yes, I'm sure"}
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
