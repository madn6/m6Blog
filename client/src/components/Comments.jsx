/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comments({ comment, onLike, onEdit,onDelete }) {
	const [user, setUser] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);

	const { currentUser } = useSelector((state) => state.user);

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
		<div className="dark:text-white flex gap-2 items-center p-4 border-b dark:border-gray-600">
			<div className="w-10 h-10 flex-shrink-0">
				<img className="rounded-full object-cover" src={user.profilePicture} alt={user.username} />
			</div>
			<div className="flex-1">
				<div className="flex items-center  mb-1">
					<span className="font-medium mr-1 text-sm truncate ">
						{user ? `@${user.username}` : 'anonymous user'}
					</span>
					<span className="text-xs text-gray-400">{moment(comment.createdAt).fromNow()}</span>
				</div>
				{isEditing ? (
					<>
						<Textarea
							className="w-full h-14 resize-none p-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:bg-gray-100"
							value={editedContent}
							onChange={(e) => {
								setEditedContent(e.target.value);
							}}
						/>
						<div className="flex items-center justify-end gap-2 mt-2">
							<Button onClick={handleSave} className="p-0 rounded-md" type="button" size="sm">
								save
							</Button>
							<Button
								onClick={() => setIsEditing(false)}
								className="p-0 rounded-md"
								type="button "
								size="sm"
							>
								cancel
							</Button>
						</div>
					</>
				) : (
					<>
						<p className="text-sm text-gray-500">{comment.content}</p>
						<div className="flex items-center pt-2 text-xs  max-w-fit gap-2">
							<button
								className={`text-gray-400 hover:text-blue-500 ${
									currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
								}`}
								type="button"
								onClick={() => onLike(comment._id)}
							>
								<FaThumbsUp className="text-sm" />
							</button>
							<p className=" text-xs text-gray-400">
								{comment.numberOfLikes > 0 &&
									comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
							</p>
							{currentUser && (currentUser.id === comment.userId || currentUser.isAdmin) && (
								<>
									<button
										onClick={handleEdit}
										className="text-gray-400 hover:text-blue-500"
										type="button"
									>
										Edit
									</button>
									<button
										onClick={()=>onDelete(comment._id)}
										className="text-gray-400 hover:text-blue-500"
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
