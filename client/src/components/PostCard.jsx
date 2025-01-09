/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';

export default function PostCard({ post }) {

	console.log(post);
	
	return (
		<div className="overflow-hidden shadow-xl rounded-lg w-full bg-gray-200 border border-gray-300">
			{/* Image Container */}
			<div className="relative  h-[180px] w-full">
				<Link to={`/post/${post.slug}`}>
					<img src={post.contentImage} alt="post" className="w-full mx-auto h-full object-cover" />
				</Link>
			</div>
			{/* Content */}
			<div className=" p-3 flex !text-light-100 items-center whitespace-nowrap justify-between gap-2">
				<p className=" text-base truncate">{post.title}</p>
				{/* <span className="text-xs italic !bg-gray-300 border-gray-100 border border-opacity-10 p-1 px-2 rounded-3xl  hidden md:inline">{post.category}</span> */}
				<Link to={`/post/${post.slug}`} >
					<button className='text-sm !bg-gray-300 text-light-100 hover:underline border-gray-100 border-opacity-10 border px-2 py-2 rounded-md hidden md:inline'>Read article</button>
				</Link>
			</div>
		</div>
	);
}
