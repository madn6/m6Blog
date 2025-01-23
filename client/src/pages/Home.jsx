import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import lottie from 'lottie-web';
import animationData from '../../public/lottie/Animation - 1736242442811.json';
import { Spinner } from 'flowbite-react';

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const lottieRef = useRef(null);
	const animationInstance = useRef(null);


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

	// Intersection Observer for detecting when the Lottie animation comes into and out of the viewport
	useEffect(() => {
		// Initialize lottie-web animation
		animationInstance.current = lottie.loadAnimation({
			container: lottieRef.current,
			animationData: animationData,
			renderer: 'svg',
			loop: true,
			autoplay: false // Start with autoplay off
		});

		console.log('Lottie animation instance created');

		const observer = new IntersectionObserver(
			([entry]) => {
				// console.log('IntersectionObserver triggered, isIntersecting:', entry.isIntersecting);

				if (entry.isIntersecting) {
					// console.log('Animation is in view - Playing');
					animationInstance.current.play(); // Play animation when in view
				} else {
					// console.log('Animation is out of view - Stopping');
					animationInstance.current.stop(); // Pause animation when out of view
				}
			},
			{ threshold: 0.1 }
		);

		if (lottieRef.current) {
			observer.observe(lottieRef.current); // Observe the element
			// console.log('Lottie element is being observed');
		}

		// Cleanup on unmount
		return () => {
			observer.disconnect(); // Disconnect observer
			animationInstance.current.destroy(); // Clean up animation instance
			// console.log('IntersectionObserver and Lottie instance destroyed');
		};
	}, []);

	return (
		<div className="min-h-screen">
			<div className=" px-2 md:px-6  w-full  mx-auto">
				<div className="flex  gap-6 lg:mt-0 md:mt-6 mt-6  mb-4   px-2  w-full  mx-auto">
					<div className="flex flex-col items-end justify-end lg:gap-4 md:gap-1 gap-1">
						<div className=" md:flex  font-Meldina  items-center gap-1 dark:text-light-100">
							<h1 className="  dark:text-light-100 text-gray-200   font-light lg:text-5xl md:text-3xl text-2xl">
								Mathan&apos;s Blog: A Personal Space with Public Conversations...
							</h1>
							{/* <FaRegPenToSquare className="lg:w-12 lg:h-12 md:w-8 md:h-8 w-6 h-6" /> */}
						</div>
						<p className=" w-full lg:text-xl md:text-lg text-lg">
							Welcome to a space where ideas come to life. Here, you&apos;ll find tech tutorials,
							personal stories, and the latest trends, all designed to inspire and connect. Join the
							conversation, share your thoughts, and help us create a community where
							everyone&apos;s voice is heard!
						</p>
					</div>
					<div ref={lottieRef} className="items-start hidden md:inline">
						<div className="" ref={lottieRef}></div>
					</div>
				</div>
				{/* <div className="border-t border-2 dark:!border-opacity-30 !border-opacity-10 border-gray-200 dark:border-gray-300 mx-[3%] lg:max-w-6xl md:max-w-4xl my-6"></div> */}
				<div className="px-2 mt-12 flex flex-col">
					{loading ? (
						<div className="flex justify-center items-center mt-12">
							<Spinner color="gray" size="md" />
						</div>
					) : (
						<>
							{posts && posts.length > 0 && (
								<>
									<div>
										<h2 className="dark:!text-light-100 text-2xl !p-0 font-medium !text-start">
											Recent Posts
										</h2>
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 my-4">
											{posts.map((post) => (
												<PostCard key={post._id} post={post} />
											))}
										</div>
									</div>
									<Link
										to={'/search'}
										className=" dark:!text-light-100 my-4 text-gray-100-100 hover:underline text-center"
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
