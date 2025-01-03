import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

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
			<div className="dark:text-white flex flex-col gap-6 p-28 px-4 lg:px-6 md:px-8 max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
				<p className="text-gray-500 text-xl ">
					Dive into a world of ideas, stories, and insights where every post is crafted with passion
					and purpose. Whether you&apos;re here to explore tech tutorials, personal reflections, or
					the latest trends, there&apos;s something for everyone. Stay updated, inspired, and
					connected as we journey through topics that spark curiosity and ignite conversations.
					Ready to discover your next favorite read? Let&apos;s get started!
				</p>
				<Link to="/search" className="text-sm  text-teal-500 font-semibold hover:underline">
					View all posts
				</Link>
			</div>
			<div className="max-w-6xl mx-auto p-3 flex flex-col">
				{posts && posts.length > 0 && (
					<>
						<div className="flex flex-wrap gap-4">
							<h2 className="text-2xl font-semibold text-center dark:text-white">Recent Posts</h2>
							<div className="flex my-4 justify-center  flex-wrap items-center gap-4">
								{posts.map((post) => (
									<PostCard key={post._id} post={post} />
								))}
							</div>
						</div>
						<Link to={'/search'} className="text-lg text-teal-500 hover:underline  text-center">
							View All Posts
						</Link>
					</>
				)}
			</div>
		</div>
	);
}
