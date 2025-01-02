import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TiUserDelete } from 'react-icons/ti';
import { HiX, HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {
	const { currentUser } = useSelector((state) => state.user);
	console.log(currentUser);

	const [comments, setComments] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [commentIdToDelete, setCommentToDelete] = useState('');

	useEffect(() => {
		if (currentUser?.isAdmin) {
			const fetchComments = async () => {
				try {
					const res = await fetch(`/api/comment/getcomments`);
					if (res.ok) {
						const data = await res.json();
						setComments(data.comments);
						if (data.comments.length < 9) {
							setShowMore(false);
						}
					} else {
						console.error('Failed to fetch comments:', res.statusText);
					}
				} catch (err) {
					console.error('Error fetching comments:', err.message);
				}
			};
			fetchComments();
		}
	}, [currentUser]);

	const handleShowMore = async () => {
		const startIndex = comments.length;
		try {
			const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
			if (res.ok) {
				const data = await res.json();
				setComments((prev) => [...prev, ...data.comments]);
				if (data.comments.length < 9) {
					setShowMore(false);
				}
			} else {
				console.error('Failed to fetch more comments:', res.statusText);
			}
		} catch (err) {
			console.log('Error fetching more comments:', err.message);
		}
	};

	const handleDeleteComment = async () => {
		try {
			const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
				method: 'DELETE'
			});
			const data = res.json();
			if (res.ok) {
				setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
				setShowModal(false);
			} else {
				console.log(data.message);
			}
		} catch (err) {
			console.log(err.message);
		}
   };
   
   console.log(comments);
   

	return (
		<div className="table-auto lg:scrollbar-none md:scrollbar-none  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{currentUser.isAdmin && comments.length > 0 ? (
				<>
					<Table hoverable className="shadow-md ">
						<Table.Head className="dark:text-white text-center ">
							<Table.HeadCell>Date updated</Table.HeadCell>
							<Table.HeadCell>Comment content</Table.HeadCell>
							<Table.HeadCell>Number of likes</Table.HeadCell>
							<Table.HeadCell>PostId</Table.HeadCell>
							<Table.HeadCell>userId</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						{comments.map((comment, i) => (
							<Table.Body key={i} className="divide-y ">
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800   ">
									<Table.Cell className="text-center">
										{new Date(comment.updatedAt).toLocaleDateString('en-GB')}
									</Table.Cell>
									<Table.Cell>
										<div className="flex items-center justify-center">{comment.content}</div>
									</Table.Cell>
									<Table.Cell className="text-center ">{comment.numberOfLikes}</Table.Cell>
									<Table.Cell className="text-center ">{comment.postId}</Table.Cell>
									<Table.Cell className="text-center">{comment.userId}</Table.Cell>
									<Table.Cell>
										<span className="flex items-center justify-center">
											<TiUserDelete
												onClick={() => {
													setShowModal(true);
													setCommentToDelete(comment._id);
												}}
												className="text-red-600   hover:scale-110 cursor-pointer w-5 h-5"
											/>
										</span>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMore && (
						<button
							onClick={handleShowMore}
							className="w-full text-teal-500 self-center text-sm py-7"
						>
							Show more...
						</button>
					)}
				</>
			) : (
				<p>You have not comments yet!</p>
			)}
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
							<Button color="failure" onClick={handleDeleteComment}>
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
