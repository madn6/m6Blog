import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { RiDeleteBin6Fill } from 'react-icons/ri';

import { HiX, HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPost() {
	const { currentUser } = useSelector((state) => state.user);
	console.log('currnet user', currentUser);

	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState('');

	useEffect(() => {
		if (currentUser?.isAdmin) {
			const fetchPosts = async () => {
				try {
					console.log('Fetching posts for userId:', currentUser._id); // Log userId for debugging
					const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`, {
						method: 'GET',
						credentials: 'include', // Ensures cookies are sent
						headers: { 'Content-Type': 'application/json' }
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
		<div className="table-auto lg:scrollbar-none md:scrollbar-none  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{currentUser.isAdmin && userPosts.length > 0 ? (
				<>
					<Table hoverable className="shadow-md ">
						<Table.Head className="dark:text-white text-center">
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
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800   ">
									<Table.Cell className="text-center">
										{new Date(post.updatedAt).toLocaleDateString('en-GB')}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${post.slug}`} className="flex items-center justify-center ">
											<img
												src={post.contentImage}
												alt={post.title}
												className="w-20 h-10 bg-gray-500 object-cover  rounded-lg"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell className="text-center">
										<Link to={`/post/${post.slug}`}>{post.title}</Link>
									</Table.Cell>
									<Table.Cell className="text-center">{post.category}</Table.Cell>
									<Table.Cell>
										<span className="flex items-center justify-center">
											<RiDeleteBin6Fill
												onClick={() => {
													setShowModal(true);
													setPostIdToDelete(post._id);
												}}
												className="text-red-600   hover:scale-110 cursor-pointer w-4 h-4"
											/>
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="text-blue-600 flex items-center justify-center "
											to={`/update-post/${post._id}`}
										>
											<AiFillEdit className="hover:scale-110 cursor-pointer w-4 h-4" />
										</Link>
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
				<p>You have not post yet!</p>
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
							Are you sure you want to delete this post?
						</h3>
						<div className="flex justify-center  gap-4">
							<Button color="failure" onClick={handleDeletePost}>
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
