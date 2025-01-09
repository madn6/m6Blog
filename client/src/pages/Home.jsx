import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { FaRegPenToSquare } from 'react-icons/fa6';
import Lottie from 'lottie-react';
import animationData from '../../public/lottie/Animation - 1736242442811.json';
import { Spinner } from 'flowbite-react';

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts`);
				if (res.ok) {
					const data = await res.json();
					// Process posts to extract the image URL from content
					const processedPosts = data.posts.map((post) => {
						const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
						const contentImage = imgTagMatch ? imgTagMatch[1] : post.image; // Use extracted image or fallback to post.image
						return { ...post, contentImage };
					});
					setPosts(processedPosts);
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
	}, []);
	console.log(posts);

	return (
		<div className="">
			<div className="  px-2 md:px-6  w-full  mx-auto">
				<div className="flex  gap-6 lg:mt-0 md:mt-6 mt-6  mb-4   px-2  w-full  mx-auto">
					<div className="flex flex-col items-start justify-end lg:gap-4 md:gap-2 gap-1">
						<div className="flex  items-center gap-2 dark:text-light-100">
							<h1 className=" dark:text-light-100 text-gray-200  font-Meldina font-regular lg:text-6xl md:text-3xl text-2xl">
								Welcome to my Blog
							</h1>
							<FaRegPenToSquare className="lg:w-12 lg:h-12 md:w-8 md:h-8 w-6 h-6" />
						</div>
						<p className=" w-full lg:text-xl md:text-xl text-lg">
							Welcome to <span className="text-green-500">Mathan&apos;s </span> space where ideas
							come to life! Dive into engaging tech tutorials, heartfelt personal reflections, and
							the latest trends designed to inspire and connect. Each post is crafted with care,
							aiming to spark curiosity and fuel meaningful conversations.
						</p>
					</div>
					<div className=" items-start hidden md:inline">
						<Lottie animationData={animationData} loop={true} play />
					</div>
				</div>
				<div className="border-t border-2 border-gray-300 opacity-10 mx-[3%] lg:max-w-6xl md:max-w-4xl my-6"></div>
				<div className="px-2 flex flex-col">
					{loading ? (
						<div className="flex justify-center items-center mt-12">
							<Spinner color="gray" size="md" />
						</div>
					) : (
						<>
							{posts && posts.length > 0 && (
								<>
									<div>
										<h2 className="dark:!text-light-100 text-2xl font-medium !text-start">
											Recent Posts
										</h2>
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
											{posts.map((post) => (
												<PostCard key={post._id} post={post} />
											))}
										</div>
									</div>
									<Link
										to={'/search'}
										className="text-lg dark:!text-light-100 text-gray-100-100 hover:underline text-center"
									>
										View All Posts...
									</Link>
								</>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
