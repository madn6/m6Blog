import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Lottie from 'lottie-react';
import animationData from '../../public/lottie/Animation - 1736242442811.json';

export default function Home() {
	const [posts, setPosts] = useState([]);

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
			}
		};
		fetchPosts();
	}, []);
	console.log(posts);

	return (
		<div>
			<div className="dark:text-white  flex flex-col gap-6 mt-14 mb-4 lg:mb-14 md:mb-14   lg:px-6 md:px-8 max-w-6xl mx-auto">
				<h1 className="  font-Meldina font-regular text-center lg:text-6xl md:text-3xl text-2xl">
					Welcome to my Blog
				</h1>
				<div className="flex gap-4 items-end ">
					<p className="md:w-3/5 lg:w-3/4 p-4 w-full lg:text-xl md:text-xl text-lg">
						Welcome to a space where ideas come to life! Dive into engaging tech tutorials,
						heartfelt personal reflections, and the latest trends designed to inspire and connect.
						Each post is crafted with care, aiming to spark curiosity and fuel meaningful
						conversations.
					</p>
					<div className="w-2/5 items-start hidden md:inline">
						<Lottie animationData={animationData} loop={true} play />
					</div>
				</div>
			</div>
			<div className="max-w-6xl mx-auto p-3 flex flex-col">
				{posts && posts.length > 0 && (
					<>
						<div className="">
							<h2 className="  text-2xl font-semibold  !text-center  ">
								Recent Posts
							</h2>
							<div className=" flex flex-wrap  my-4 justify-center items-center gap-4">
								{posts.map((post) => (
									<PostCard key={post._id} post={post} />
								))}
							</div>
						</div>
						<Link to={'/search'} className="text-lg text-gray-100-100 hover:underline  text-center">
							View All Posts...
						</Link>
					</>
				)}
			</div>
		</div>
	);
}
