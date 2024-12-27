/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import moment from 'moment';

export default function Comments({ comment }) {
	const [user, setUser] = useState({});

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
				<p className='text-sm text-gray-500'>{comment.content}</p>
			</div>
		</div>
	);
}
