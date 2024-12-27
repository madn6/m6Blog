import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export default function CommentSection({ postId }) {
	const [comment, setComment] = useState('');
	const [commentError, setCommentError] = useState(null);
	const [buttonDisabled, setButtonDisabled] = useState(true);

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
			if (data.success) {
				setComment('');
				setCommentError(null);
			}
		} catch (error) {
			setCommentError(error.message);
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
							alt="profile"
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
			</div>
		</div>
	);
}
