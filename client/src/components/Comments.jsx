/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comments({ comment, onLike, onEdit, onDelete }) {
	const [user, setUser] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);

	const { currentUser } = useSelector((state) => state.user);
	console.log('currentuser: ', currentUser);
	console.log('comment id:',comment.userId);
	console.log('comment id:',comment);
	
	useEffect(() => {
		if (!comment?.userId) return;
		const getUser = async () => {
			try {
				const res = await fetch(`/api/user/${comment.userId}`);
				const data = await res.json();
				if (res.ok) {
					setUser(data);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		getUser();
	}, [comment]);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedContent(comment.content);
	};

	const handleSave = async () => {
		try {
			const res = await fetch(`/api/comment/editComment/${comment._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: editedContent
				})
			});
			if (res.ok) {
				setIsEditing(false);
				onEdit(comment, editedContent);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="dark:text-light-100 flex gap-2 items-center p-2 border-b dark:!border-opacity-30 !border-opacity-10 border-gray-200 dark:border-gray-300">
			<div className="w-10 h-10 flex-shrink-0">
				<img className="rounded-full object-cover" src={user.profilePicture} alt={user.username} />
			</div>
			<div className="flex-1">
				<div className="flex items-center  mb-1">
					<span className="font-medium mr-1 text-sm truncate ">
						{user ? `@${user.username}` : 'anonymous user'}
					</span>
					<span className="text-xs text-gray-100 ">{moment(comment.createdAt).fromNow()}</span>
				</div>
				{isEditing ? (
					<>
						<Textarea
							className="w-full h-14 resize-none focus:ring-0  placeholder:!text-light-100 !bg-gray-300 !text-light-100 !border-opacity-10 !border-gray-100"
							value={editedContent}
							onChange={(e) => {
								setEditedContent(e.target.value);
							}}
						/>
						<div className="flex items-center justify-end gap-2 mt-2">
							<Button onClick={handleSave} className="p-0 text-sm focus:ring-0  cursorpointe !bg-gray-300 text-light-100   border-gray-100 border-opacity-10 border  rounded-md" type="button" size="sm">
								save
							</Button>
							<Button
								onClick={() => setIsEditing(false)}
								className="p-0 text-sm focus:ring-0  cursorpointe !bg-gray-300 text-light-100   border-gray-100 border-opacity-10 border  rounded-md"
								type="button "
								size="sm"
							>
								cancel
							</Button>
						</div>
					</>
				) : (
					<>
						<p className="text-sm dark:text-gray-100 text-gray-300">{comment.content}</p>
						<div className="flex items-start pt-2 text-xs  max-w-fit gap-2">
							<button
								className={`text-gray-100 dark:hover:text-light-100 hover:text-dark-200 ${
									currentUser && comment.likes.includes(currentUser._id) && 'dark:!text-light-100 !text-dark-200'
								}`}
								type="button"
								onClick={() => onLike(comment._id)}
							>
								<FaThumbsUp className="text-sm " />
							</button>
							<p className=" text-xs dark:!text-gray-100 !text-gray-200">
								{comment.numberOfLikes > 0 &&
									comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
							</p>
							{currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
								<>
									<button
										onClick={handleEdit}
										className="text-gray-200 dark:!text-gray-100 dark:hover:!text-blue-500 hover:!text-blue-500"
										type="button"
									>
										Edit
									</button>
									<button
										onClick={() => onDelete(comment._id)}
										className="text-gray-200 dark:!text-gray-100 dark:hover:!text-red-500 hover:!text-red-500"
										type="button"
									>
										Delete
									</button>
								</>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
