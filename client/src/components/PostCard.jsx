/* eslint-disable react/prop-types */

import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {

	console.log(post);
	
	return (
		<div className="overflow-hidden shadow-lg rounded-lg w-[350px] md:mb-0 lg:mb-0 mb-4  bg-gray-200 border border-gray-300">
			{/* Image Container */}
			<div className="relative h-[220px] w-full">
				<Link to={`/post/${post.slug}`}>
					<img src={post.contentImage} alt="post" className="w-full h-full object-cover" />
				</Link>
			</div>
			{/* Content */}
			<div className="dark:text-white p-3 flex items-center whitespace-nowrap justify-between gap-2">
				<p className="truncate text-sm">{post.title}</p>
				<span className="text-xs italic !bg-gray-300 border-gray-100 border border-opacity-10 p-1 px-2 rounded-3xl ">{post.category}</span>
				<Link to={`/post/${post.slug}`} >
					<Button className='text-sm !bg-gray-300 hover:underline border-gray-100 border-opacity-10 border'>Read article</Button>
				</Link>
			</div>
		</div>
	);
}
