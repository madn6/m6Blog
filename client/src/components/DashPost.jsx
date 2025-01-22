import { Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { Spinner } from 'flowbite-react';
import { HiX, HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPost() {
	const { currentUser } = useSelector((state) => state.user);
	console.log('currnet user', currentUser);

	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [postIdToDelete, setPostIdToDelete] = useState('');

	useEffect(() => {
		if (currentUser?.isAdmin) {
			const fetchPosts = async () => {
				try {
					console.log('Fetching posts for userId:', currentUser._id);
					const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`, {
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (res.ok) {
						const data = await res.json();
						console.log('Fetched posts:', data.posts); // Log fetched posts
						const processedPosts = data.posts.map((post) => {
							const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
							const contentImage = imgTagMatch ? imgTagMatch[1] : post.image;
							return { ...post, contentImage };
						});
						setUserPosts(processedPosts);
						if (data.posts.length < 9) {
							setShowMore(false);
						}
					} else {
						console.error('Failed to fetch posts:', res.statusText);
					}
				} catch (err) {
					console.error('Error fetching posts:', err.message);
				} finally {
					setLoading(false);
				}
			};
			fetchPosts();
		}
	}, [currentUser]);

	console.log(userPosts);

	const handleShowMore = async () => {
		const startIndex = userPosts.length;
		try {
			const res = await fetch(
				`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				// Process posts to extract the image URL from content
				const processedPosts = data.posts.map((post) => {
					const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
					const contentImage = imgTagMatch ? imgTagMatch[1] : post.image; // Use extracted image or fallback
					return { ...post, contentImage }; // Add contentImage to post object
				});
				// Append new processed posts to the existing userPosts
				setUserPosts((prev) => [...prev, ...processedPosts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				}
			}
			fetch;
		} catch (err) {
			console.log(err);
		}
	};

	const handleDeletePost = async () => {
		setShowModal(false);
		try {
			const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
				method: 'DELETE'
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className="table-auto  my-3 min-h-screen overflow-x-auto md:mx-auto p-3 scrollbar-hide">
			{loading ? (
				<div className="flex justify-center items-center mt-12">
					<Spinner color="gray" size="md" />
				</div>
			) : (
				<>
					{currentUser.isAdmin && userPosts.length > 0 ? (
						<>
							<Table hoverable className="shadow-md  ">
								<Table.Head className=" text-center ">
									<Table.HeadCell>Date updated</Table.HeadCell>
									<Table.HeadCell>Post image</Table.HeadCell>
									<Table.HeadCell>Post Title</Table.HeadCell>
									<Table.HeadCell>Category</Table.HeadCell>
									<Table.HeadCell>Delete</Table.HeadCell>
									<Table.HeadCell>
										<span>Edit</span>
									</Table.HeadCell>
								</Table.Head>
								{userPosts.map((post, i) => (
									<Table.Body key={i} className="divide-y ">
										<Table.Row className=" dark:bg-gray-200 dark:hover:!bg-gray-300 dark:hover:!bg-opacity-30   hover:!bg-gray-300 hover:!bg-opacity-10 dark:!text-gray-100 text-gray-200">
											<Table.Cell className="text-center">
												{new Date(post.updatedAt).toLocaleDateString('en-GB')}
											</Table.Cell>
											<Table.Cell>
												<Link
													to={`/post/${post.slug}`}
													className="flex items-center justify-center"
												>
													<img
														src={post.contentImage}
														alt={post.title}
														className="w-20 h-10 object-cover rounded-md min-w-[5rem] min-h-[2.5rem]"
													/>
												</Link>
											</Table.Cell>
											<Table.Cell className="text-center ">
												<Link
													to={`/post/${post.slug}`}
													className=" line-clamp-2 md:whitespace-normal dark:text-light-100"
												>
													{post.title}
												</Link>
											</Table.Cell>
											<Table.Cell className="text-center">{post.category}</Table.Cell>
											<Table.Cell>
												<span className="flex items-center justify-center">
													<span className="text-red-400 focus:ring-0 outline-none text-xs border border-opacity-30 border-red-600 bg-red-600 bg-opacity-20 p-2  rounded-md">
														<RiDeleteBin6Fill
															onClick={() => {
																setShowModal(true);
																setPostIdToDelete(post._id);
															}}
															className="text-red-400 hover:scale-110 cursor-pointer w-4 h-4"
														/>
													</span>
												</span>
											</Table.Cell>
											<Table.Cell>
												<Link
													className=" flex items-center justify-center "
													to={`/update-post/${post._id}`}
												>
													<span className='text-green-400 focus:ring-0 outline-none text-xs border border-opacity-30 border-green-600 bg-green-600 bg-opacity-20 p-2  rounded-md'>
														<AiFillEdit className="hover:scale-110 text-green-400 cursor-pointer w-4 h-4" />
													</span>
												</Link>
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
						<p>You have not post yet!</p>
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
										onClick={handleDeletePost}
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
				</>
			)}
		</div>
	);
}
