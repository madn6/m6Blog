import { Button, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashComponent() {
	const [users, setUsers] = useState([]);
	const [comments, setComments] = useState([]);
	const [posts, setPosts] = useState([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalPosts, setTotalPosts] = useState(0);
	const [totalComments, setTotalComments] = useState(0);
	const [lastMonthUsers, setLastMonthUsers] = useState(0);
	const [lastMonthPosts, setLastMonthPosts] = useState(0);
	const [lastMonthComments, setLastMonthComments] = useState(0);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		if (!currentUser?.isAdmin) return;

		const fetchUsers = async () => {
			try {
				const res = await fetch('/api/user/getusers?limit=5');
				if (!res.ok) {
					console.error(`Fetch Users Error: ${res.status}`);
					console.log('Response Body:', await res.text());
					return;
				}
				const data = await res.json();

				setUsers(data.users);
				setTotalUsers(data.totalUsers);
				setLastMonthUsers(data.lastMonthUsers);
			} catch (error) {
				console.error('Error fetching users:', error.message);
			}
		};

		const fetchPosts = async () => {
			try {
				const res = await fetch('/api/post/getposts?limit=5');
				if (!res.ok) {
					console.error('Failed to fetch posts:', res.statusText);
					return; // Stop execution if response is not ok
				}

				const data = await res.json();

				// Process posts to extract the image URL from content
				const processedPosts = data.posts.map((post) => {
					const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
					const contentImage = imgTagMatch ? imgTagMatch[1] : post.image; // Use extracted image or fallback to post.image
					return { ...post, contentImage };
				});

				// Update state with processed posts and metadata
				setPosts(processedPosts);
				setTotalPosts(data.totalPosts || 0); // Ensure fallback if undefined
				setLastMonthPosts(data.lastMonthPost || 0); // Ensure fallback if undefined
            
				console.log('Posts fetched successfully:', processedPosts);
			} catch (error) {
				console.error('Error fetching posts:', error.message);
			}
		};

		const fetchComments = async () => {
			try {
				const res = await fetch('/api/comment/getcomments?limit=5');
				if (!res.ok) {
					console.error(`Comments Fetch Error: ${res.status}`);
					return;
				}
				const data = await res.json();
				setComments(data.comments);
				setTotalComments(data.totalComments);
				setLastMonthComments(data.lastMonthComments);
			} catch (error) {
				console.error('Error fetching comments:', error.message);
			}
		};

		fetchUsers();
		fetchPosts();
		fetchComments();
	}, [currentUser]); // Ensure currentUser updates are handled correctly


	return (
		<div className="p-3 md:mx-auto ">
			<div className="flex-wrap flex gap-4 justify-center">
				<div className="dark:text-white  flex flex-col p-3 dark:bg-slate-800 gap-1  md:w-72 w-full rounded-lg shadow-md">
					<div className="flex flex-col-reverse gap-2 items-center justify-between">
						<div className="">
							<h3 className="text-gray-500 text-md uppercase font-semibold">Total Users</h3>
							<p className="text-2xl text-center">{totalUsers}</p>
						</div>
						<span>
							<HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
						</span>
					</div>

					<div className="flex gap-2 text-sm self-center">
						<span className="text-green-500 flex items-center">
							<HiArrowNarrowUp />
							{lastMonthUsers}
						</span>
						<div className="text-gray-500">Last month</div>
					</div>
				</div>

				<div className="dark:text-white  flex flex-col p-3 dark:bg-slate-800 gap-1  md:w-72 w-full rounded-lg shadow-md">
					<div className="flex flex-col-reverse gap-2 items-center justify-between">
						<div className="">
							<h3 className="text-gray-500 text-md uppercase font-semibold">Total Comments</h3>
							<p className="text-2xl text-center">{totalComments}</p>
						</div>
						<span>
							<HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
						</span>
					</div>

					<div className="flex gap-2 text-sm self-center">
						<span className="text-green-500 flex items-center">
							<HiArrowNarrowUp />
							{lastMonthComments}
						</span>
						<div className="text-gray-500">Last month</div>
					</div>
				</div>

				<div className="dark:text-white  flex flex-col p-3 dark:bg-slate-800 gap-1  md:w-72 w-full rounded-lg shadow-md">
					<div className="flex flex-col-reverse gap-2 items-center justify-between">
						<div className="">
							<h3 className="text-gray-500 text-md uppercase font-semibold">Total Posts</h3>
							<p className="text-2xl text-center">{totalPosts}</p>
						</div>
						<span>
							<HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
						</span>
					</div>

					<div className="flex gap-2 text-sm self-center">
						<span className="text-green-500 flex items-center">
							<HiArrowNarrowUp />
							{lastMonthPosts}
						</span>
						<div className="text-gray-500">Last month</div>
					</div>
				</div>
			</div>
			{/* bottom */}
			<div className="flex flex-wrap gap-4 py-3 mx-auto  justify-center">
				<div className="flex flex-col w-full md:w-auto shadow-md mt-2 rounded-lg dark:bg-slate-800">
					<div className="flex justify-between p-3 text-sm font-medium">
						<h1 className=" dark:text-white text-center p-2">Recent Users</h1>
						<Button>
							<Link to={'/dashboard?tab=users'}>See all</Link>
						</Button>
					</div>
					<Table>
						<Table.Head className="">
							<Table.HeadCell className="!rounded-none">User image</Table.HeadCell>
							<Table.HeadCell className="!rounded-none">Username</Table.HeadCell>
						</Table.Head>
						{users &&
							users.map((user) => (
								<Table.Body key={user._id} className="divide-y">
									<Table.Row className="bg-white dark:border-gray-700 dark:bg-slate-800">
										<Table.Cell>
											<img
												src={user.profilePicture}
												alt="user"
												className="w-10 h-10 object-cover rounded-full bg-gray-500"
											/>
										</Table.Cell>
										<Table.Cell>{user.username}</Table.Cell>
									</Table.Row>
								</Table.Body>
							))}
					</Table>
				</div>

				<div className="flex flex-col  w-full md:w-auto shadow-md mt-2 rounded-lg dark:bg-slate-800">
					<div className="flex justify-between p-3 text-sm font-medium">
						<h1 className=" dark:text-white text-center p-2">Recent Comments</h1>
						<Button>
							<Link to={'/dashboard?tab=comments'}>See all</Link>
						</Button>
					</div>
					<Table>
						<Table.Head className="">
							<Table.HeadCell className="!rounded-none">Comment content</Table.HeadCell>
							<Table.HeadCell className="!rounded-none">Likes</Table.HeadCell>
						</Table.Head>
						{comments &&
							comments.map((comment) => (
								<Table.Body key={comment._id} className="divide-y">
									<Table.Row className="bg-white dark:border-gray-700 dark:bg-slate-800">
										<Table.Cell className="w-96">
											<p className="line-clamp-2">{comment.content}</p>
										</Table.Cell>
										<Table.Cell className="text-center">{comment.numberOfLikes}</Table.Cell>
									</Table.Row>
								</Table.Body>
							))}
					</Table>
				</div>

				<div className="flex flex-col w-full md:w-auto shadow-md mt-2 rounded-lg dark:bg-slate-800">
					<div className="flex justify-between p-3 text-sm font-medium">
						<h1 className=" dark:text-white text-center p-2">Recent Posts</h1>
						<Button>
							<Link to={'/dashboard?tab=users'}>See all</Link>
						</Button>
					</div>
					<Table>
						<Table.Head className="">
							<Table.HeadCell className="!rounded-none">Post image</Table.HeadCell>
							<Table.HeadCell className="!rounded-none">Post Title</Table.HeadCell>
							<Table.HeadCell className="!rounded-none">Category</Table.HeadCell>
						</Table.Head>
						{posts &&
							posts.map((post) => (
								<Table.Body key={post._id} className="divide-y">
									<Table.Row className="bg-white dark:border-gray-700 dark:bg-slate-800">
										<Table.Cell>
											<img
												src={post.contentImage}
												alt="post"
												className="w-20 h-12 object-cover rounded-lg bg-gray-500"
											/>
										</Table.Cell>
										<Table.Cell className="w-96 text-center">{post.title}</Table.Cell>
										<Table.Cell className="w-5 text-center">{post.category}</Table.Cell>
									</Table.Row>
								</Table.Body>
							))}
					</Table>
				</div>
			</div>
		</div>
	);
}
