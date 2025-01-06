import { Spinner, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CommentSection, PostCard } from '../components';

export default function Postpage() {
	const { postSlug } = useParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [post, setPost] = useState(null);
	const [recentPosts, setRecentPosts] = useState(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
				if (!res.ok) {
					setError(true);
					setLoading(false);
					return;
				}
				const data = await res.json();
				const processedPosts = data.posts.map((post) => {
					const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
					const contentImage = imgTagMatch ? imgTagMatch[1] : post.image;
					return { ...post, contentImage };
				});
				console.log(post);
				setPost(processedPosts[0]);
				setLoading(false);
				setError(false);
			} catch (error) {
				console.log(error);
				setError(true);
				setLoading(false);
			}
		};
		fetchPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postSlug]);

	useEffect(() => {
		const fetchRecentPosts = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/post/getposts?limit=3`);
				if (!res.ok) {
					throw new Error(`Error: ${res.status} ${res.statusText}`);
				}
				const data = await res.json();
				// Process posts to extract content images or use default image
				const processedPosts = data.posts.map((post) => {
					const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
					const contentImage = imgTagMatch ? imgTagMatch[1] : post.image;
					return { ...post, contentImage };
				});
				setRecentPosts(processedPosts);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch recent posts:', error.message);
				setError(true);
				setLoading(false);
			}
		};
		fetchRecentPosts();
	}, []);


	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Spinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p className="text-red-500">Error loading the post.</p>
			</div>
		);
	}

	function cleanHtmlContent(content) {
		// Remove <strong> tags but keep their inner content
		content = content.replace(/<\/?strong>/g, '');

		// Remove empty <br> tags
		content = content.replace(/<br\s*\/?>\s*/g, '');

		// Remove empty <p> tags
		content = content.replace(/<p>\s*<\/p>/g, '');

		// Remove empty heading tags (e.g., <h1>, <h2>, etc.)
		content = content.replace(/<h[1-6]>\s*<\/h[1-6]>/g, '');

		// Remove any other empty tags (e.g., <em>, <span>, etc.)
		content = content.replace(/<([a-z]+)>\s*<\/\1>/g, '');

		// Clean up extra spaces caused by removed tags
		content = content.replace(/\s+/g, ' ').trim();

		return content;
	}

	const cleanedContent = cleanHtmlContent(post?.content || '');

	// Helper function to strip HTML tags and calculate content length
	const getReadingTime = (content) => {
		const textContent = content.replace(/<[^>]*>/g, ''); // Remove all HTML tags
		const words = textContent.split(/\s+/).length; // Split the content into words
		const minutes = Math.ceil(words / 200); // Approx 200 words per minute reading speed
		return minutes;
	};

	const readingTime = post ? getReadingTime(post.content) : 0;
	console.log('xxxxx',post);
	

	return (
		<div>
			<div className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
				<h1 className="text-3xl dark:text-white mt-10 p-3 text-center font-semibold max-w-2xl mx-auto lg:text-4xl">
					{post?.title}
				</h1>
				<Link to={`/search/?category=${post?.category}`} className="self-center">
					<Button color="gray" className="w-fit  mt-5 px-1 py-0 rounded-3xl">
						{post?.category}
					</Button>
				</Link>
				{/* <div className="overflow-hidden rounded-lg mt-10 p-3 w-full mx-auto">
					<img
						src={post?.contentImage || post?.image}
						alt={post?.title || 'Post Image'}
						className="w-full max-h-[600px] object-cover rounded-lg"
					/>
				</div> */}
				<div className="flex items-center max-w-3xl  mt-12 gap-4 dark:text-white justify-between p-3 mx-auto w-full  text-xs">
					<span>{post && new Date(post.createdAt).toLocaleDateString('en-GB')}</span>
					<span className="italic">{readingTime}&nbsp;mins read</span>
				</div>
				<div className="prose dark:prose-invert p-3 max-w-3xl mx-auto w-full">
					{/* Render the HTML content directly */}
					<div className="post__content" dangerouslySetInnerHTML={{ __html: cleanedContent }}></div>
				</div>
			</div>
			{post && <CommentSection postId={post._id} />}
			<div className="flex flex-col justify-center items-center mb-5">
				<h1 className="text-xl mt-5 dark:text-white font-semibold"> Recent articles</h1>
				<div className="md:flex flex-wrap items-center justify-center gap-4  mx-4 my-4">
					{recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
				</div>
			</div>
		</div>
	);
}
