import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
	const [sidebarData, setSidebarData] = useState({
		SearchTerm: '',
		sort: 'desc',
		category: 'uncategorized'
	});

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm') || '';
		const sortFromUrl = urlParams.get('sort') || 'desc';
		const categoryFromUrl = urlParams.get('category') || 'uncategorized';

		console.log('Category from URL:', categoryFromUrl); // Log the category from URL

		setSidebarData((prevData) => ({
			...prevData,
			SearchTerm: searchTermFromUrl,
			sort: sortFromUrl,
			category: categoryFromUrl
		}));

		// Fetch posts from the backend
		const fetchPosts = async () => {
			try {
				setLoading(true);

				const query = new URLSearchParams({
					searchTerm: searchTermFromUrl,
					sort: sortFromUrl,
					category: categoryFromUrl
				}).toString();
				console.log('Fetch query:', query); // Log the query string
				const res = await fetch(`/api/post/getposts?${query}`);
				if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

				const data = await res.json();
				const processedPosts = data.posts.map((post) => {
					const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
					const contentImage = imgTagMatch ? imgTagMatch[1] : post.image;
					return { ...post, contentImage };
				});

				setPosts(processedPosts);
				setShowMore(processedPosts.length === 9);
			} catch (error) {
				console.error('Error fetching posts:', error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [location.search]);

	const handleChange = (e) => {
		if (e.target.id === 'searchTerm') {
			setSidebarData({ ...sidebarData, SearchTerm: e.target.value }); // Update SearchTerm
		}
		if (e.target.id === 'sort') {
			const order = e.target.value || 'desc';
			setSidebarData({ ...sidebarData, sort: order });
		}
		if (e.target.id === 'category') {
			const category = e.target.value || 'uncategorized';
			setSidebarData({ ...sidebarData, category });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const urlParams = new URLSearchParams();
		urlParams.set('searchTerm', sidebarData.SearchTerm || '');
		urlParams.set('sort', sidebarData.sort || 'desc');
		urlParams.set('category', sidebarData.category || 'uncategorized');

		navigate(`/search?${urlParams.toString()}`);
	};

	const handleShowMore = async () => {
		try {
			setLoading(true); // Start loading indicator

			const startIndex = posts.length; // Determine the index from where to fetch

			const urlParams = new URLSearchParams(location.search);
			urlParams.set('startIndex', startIndex);

			// Fetch additional posts
			const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

			const data = await res.json();
			const processedPosts = data.posts.map((post) => {
				const imgTagMatch = post.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*>/);
				const contentImage = imgTagMatch ? imgTagMatch[1] : post.image;
				return { ...post, contentImage };
			});

			// Append new posts to the existing posts
			setPosts((prevPosts) => [...prevPosts, ...processedPosts]);

			// Determine if "Show More" should be displayed
			setShowMore(processedPosts.length === 9);
		} catch (error) {
			console.error('Error fetching more posts:', error.message);
		} finally {
			setLoading(false); // Stop loading indicator
		}
	};

	return (
		<div className="flex flex-col md:flex-row">
			<div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col items-center gap-2">
						<label className="dark:text-white whitespace-nowrap font-semibold">Search Term</label>
						<TextInput
							onChange={handleChange}
							value={sidebarData.SearchTerm || ''} // Make sure value is bound correctly
							placeholder="Search..."
							id="searchTerm"
							type="text"
						/>
					</div>
					<div className="flex flex-col items-center gap-2">
						<label className="dark:text-white whitespace-nowrap font-regular">Sort</label>
						<Select value={sidebarData.sort} id="sort" onChange={handleChange}>
							<option value="desc">Latest</option>
							<option value="asc">Oldest</option>
						</Select>
					</div>
					<div className="flex flex-col items-center gap-2">
						<label className="dark:text-white whitespace-nowrap font-regular">Category</label>
						<Select value={sidebarData.category} id="category" onChange={handleChange}>
							<option value="uncategorized">uncategorized</option>
							<option value="ai">Ai</option>
							<option value="dogs">Dogs</option>
							<option value="mobile">Mobile</option>
							<option value="gpu">Gpu</option>
						</Select>
					</div>
					<Button type="submit">Apply Filters</Button>
				</form>
			</div>
			<div className="w-full">
				<h1 className="text-3xl dark:text-white font-semibold sm:border-b border-gray-500 p-3 mt-5">
					Posts results
				</h1>
				<div className="p-7 flex flex-wrap justify-center gap-4">
					{loading && <p className="text-xl text-gray-500">Loading...</p>}
					{!loading && posts.length === 0 && (
						<p className="text-xl text-gray-500">No posts found.</p>
					)}
					{!loading && posts.map((post) => <PostCard key={post._id} post={post} />)}
					{showMore && (
						<button onClick={handleShowMore} className="text-teal-500 hover:underline p-7 w-full">
							Show More
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
