/* eslint-disable react/prop-types */

import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
	return (
		<div className="overflow-hidden shadow-lg rounded-lg w-[350px] md:mb-0 lg:mb-0 mb-4  bg-gray-100">
			{/* Image Container */}
			<div className="relative h-[220px] w-full">
				<Link to={`/post/${post.slug}`}>
					<img src={post.contentImage} alt="post" className="w-full h-full object-cover" />
				</Link>
			</div>
			{/* Content */}
			<div className="dark:text-white p-3 flex items-center whitespace-nowrap justify-between gap-2">
				<p className="truncate text-sm">{post.title}</p>
				<span className="text-xs italic">{post.category}</span>
				<Link to={`/post/${post.slug}`}>
					<Button className='text-sm'>Read article</Button>
				</Link>
			</div>
		</div>
	);
}
