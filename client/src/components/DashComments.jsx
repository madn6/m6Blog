import { Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiX, HiOutlineExclamationCircle } from 'react-icons/hi';
import { Spinner } from 'flowbite-react';
import { RiDeleteBin6Fill } from 'react-icons/ri';

export default function DashComments() {
	const { currentUser } = useSelector((state) => state.user);
	console.log(currentUser);

	const [comments, setComments] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [commentIdToDelete, setCommentToDelete] = useState('');
	const [loading, setLoading] = useState(true);

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
				} finally {
					setLoading(false);
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

	console.log('comments:', comments);

	return (
		<div className="table-auto my-3 min-h-screen overflow-x-auto md:mx-auto p-3 scrollbar-hide">
			{loading ? (
				<div className="flex justify-center items-center mt-12">
					<Spinner color="gray" size="md" />
				</div>
			) : (
				<>
					{currentUser.isAdmin && comments.length > 0 ? (
						<>
							<Table hoverable className="shadow-md ">
								<Table.Head className="dark:text-white text-start ">
									<Table.HeadCell className="text-center">Date updated</Table.HeadCell>
									<Table.HeadCell className="text-center">Comment content</Table.HeadCell>
									<Table.HeadCell className="text-center">Number of likes</Table.HeadCell>
									<Table.HeadCell className="text-center">PostId</Table.HeadCell>
									<Table.HeadCell className="text-center">userId</Table.HeadCell>
									<Table.HeadCell className="text-center">Delete</Table.HeadCell>
								</Table.Head>
								{comments.map((comment, i) => (
									<Table.Body key={i} className="divide-y">
										<Table.Row className=" dark:bg-gray-200 dark:hover:!bg-gray-300 dark:hover:!bg-opacity-30   hover:!bg-gray-300 hover:!bg-opacity-10 dark:!text-gray-100 text-gray-200 ">
											<Table.Cell className="text-center">
												{new Date(comment.updatedAt).toLocaleDateString('en-GB')}
											</Table.Cell>
											<Table.Cell>
												<div className="text-start dark:text-light-100  min-w-[200px]">
													{comment.content}
												</div>
											</Table.Cell>
											<Table.Cell className=" text-center ">{comment.numberOfLikes}</Table.Cell>
											<Table.Cell className=" text-center ">{comment.postId}</Table.Cell>
											<Table.Cell className=" text-center">{comment.userId}</Table.Cell>
											<Table.Cell>
												<span className="flex items-center justify-center">
													<span className='text-red-400 focus:ring-0 outline-none text-xs border border-opacity-30 border-red-600 bg-red-600 bg-opacity-20 p-2  rounded-md'>
														<RiDeleteBin6Fill
															onClick={() => {
																setShowModal(true);
																setCommentToDelete(comment._id);
															}}
															className="dark:text-red-400 text-red-500    hover:scale-110 cursor-pointer w-4 h-4"
														/>
													</span>
												</span>
											</Table.Cell>
										</Table.Row>
									</Table.Body>
								))}
							</Table>
							{showMore && (
								<button
									onClick={handleShowMore}
									className="w-full dark:text-gray-100 text-gray-200 self-center text-sm py-4"
								>
									Show more...
								</button>
							)}
						</>
					) : (
						<p>You have not comments yet!</p>
					)}
				</>
			)}

			<Modal
				className="bg-black  bg-opacity-50 overflow-hidden"
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				size="md"
			>
				<span
					onClick={() => setShowModal(false)}
					className="flex bg-gray-200  rounded-tl-md rounded-tr-md border-gray-100 border-opacity-10 border border-b-0   items-center justify-end p-2 cursor-pointer"
				>
					<HiX className="hover:scale-110 h-5 w-5 text-gray-100 transition-all duration-150" />
				</span>
				<Modal.Body className="!bg-gray-200 border-gray-100 border-opacity-10  rounded-bl-md rounded-br-md  border border-t-0">
					<div className="text-center">
						<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 " />
						<h3 className="mb-5  font-normal !text-gray-100 ">
							Are you sure you want to delete your account?
						</h3>
						<div className="flex mt-3 justify-center  gap-4">
							<button
								className="text-red-400 focus:ring-0 outline-none text-xs border border-opacity-30 border-red-600 bg-red-600 bg-opacity-20 p-3  rounded-lg"
								onClick={handleDeleteComment}
							>
								{"Yes, I'm sure"}
							</button>
							<button
								className="text-green-400 text-xs focus:ring-0 outline-none border border-opacity-30 border-green-600 bg-green-600 bg-opacity-20 p-3  rounded-lg"
								onClick={() => setShowModal(false)}
							>
								No, cancel
							</button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
