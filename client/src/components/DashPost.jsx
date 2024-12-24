import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

export default function DashPost() {
	const { currentUser } = useSelector((state) => state.user);

	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);

	useEffect(() => {
		if (currentUser?.isAdmin) {
			const fetchPosts = async () => {
				try {
					const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
					console.log('Response:', res); // Log the entire response object
					if (res.ok) {
						const data = await res.json();
						console.log('Posts received:', data.posts); // Log the posts data
						setUserPosts(data.posts);
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

	const handleShowMore = async () => {
		const startIndex = userPosts.length;
		try {
			const res = await fetch(
				`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserPosts((prev) => [...prev, ...data.posts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="table-auto lg:scrollbar-none md:scrollbar-none  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{currentUser.isAdmin && userPosts.length > 0 ? (
				<>
					<Table hoverable className="shadow-md ">
						<Table.Head className="dark:text-white">
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
												src={post.image}
												alt={post.title}
												className="w-20 h-10 bg-gray-500 object-cover rounded-lg"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell className="text-center">
										<Link to={`/post/${post.slug}`}>{post.title}</Link>
									</Table.Cell>
									<Table.Cell className="text-center">{post.category}</Table.Cell>
									<Table.Cell>
										<span className="flex items-center justify-center">
											<AiFillDelete className="text-red-500   hover:scale-110 cursor-pointer w-4 h-4" />
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="text-teal-400 flex items-center justify-center "
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
		</div>
	);
}
