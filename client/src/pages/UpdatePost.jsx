import { FileInput, Select, TextInput, Button, Alert } from 'flowbite-react';
import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
	const [file, setFile] = useState(null);
	const [formData, setFormData] = useState({});
	const [publishError, setPublishError] = useState(null);
	const [loading, setLoading] = useState(true);

	console.log(formData);

	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadError, setImageUploadError] = useState(null);

	const quillRef = useRef(null);
	const fileInputRef = useRef(null);
	const navigate = useNavigate();
	const { postId } = useParams();

	const { currentUser } = useSelector((state) => state.user);
	useEffect(() => {
		if (!postId) {
			console.error('No postId provided');
			return;
		}
		const fetchPost = async () => {
			try {
				const res = await fetch(`/api/post/getposts?postId=${postId}`);
				const data = await res.json();
				console.log('API Response:', res, data); // Log both the response and data
				if (res.ok) {
					setFormData(data.posts[0]);
					setLoading(false); // Stop the loading state
				} else {
					setPublishError(data.message || 'Error fetching post');
					setLoading(false);
				}
			} catch (err) {
				console.error('Error fetching post:', err.message);
				setPublishError('Something went wrong while fetching the post.');
				setLoading(false);
			}
		};
		fetchPost();
	}, [postId]);

	if (loading) return <div>Loading...</div>;

	// Handle file upload to Cloudinary
	const handleUploadImage = async () => {
		if (!file) {
			setImageUploadError('Please select an image.');
			console.error('No file selected for upload.');
			return;
		}

		try {
			setImageUploadError(null);
			setImageUploadProgress(0); // Reset progress to 0

			// Create FormData to send the image file
			const formData = new FormData();
			formData.append('file', file);
			formData.append('upload_preset', 'profile_pictures'); // You can change this as needed
			formData.append('folder', 'blog_images'); // You can change this as needed

			// Create XMLHttpRequest to track progress
			const xhr = new XMLHttpRequest();
			xhr.open('POST', `https://api.cloudinary.com/v1_1/dgucqdmfv/image/upload`, true);

			// Track progress
			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const progress = Math.round((event.loaded / event.total) * 100);
					if (progress !== imageUploadProgress) {
						setImageUploadProgress(progress); // Update progress only when it changes
					}
				}
			};

			xhr.onload = async () => {
				const data = JSON.parse(xhr.responseText);

				if (data.secure_url) {
					console.log('Image uploaded:', data.secure_url);

					// Insert the uploaded image into the Quill editor
					const quillEditor = quillRef.current.getEditor();
					const range = quillEditor.getSelection();
					const index = range ? range.index : quillEditor.getLength(); // Use cursor position or insert at the end

					// Insert image into the editor
					quillEditor.insertEmbed(index, 'image', data.secure_url);

					// Reset progress after upload
					setImageUploadProgress(null); // Hide the progress bar after the upload
					setFile(null);
					fileInputRef.current.value = null;
				} else {
					console.error('Image upload failed:', data);
					setImageUploadError('Image upload failed');
					setImageUploadProgress(null);
				}
			};

			xhr.onerror = () => {
				setImageUploadError('Error uploading image.');
				setImageUploadProgress(null);
			};

			xhr.send(formData); // Send the request with the image data
		} catch (error) {
			console.error('Error uploading image:', error);
			setImageUploadError('Image upload failed');
			setImageUploadProgress(null);
		}
	};

	console.log('this is formdata id', formData._id);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Check if postId is valid
		if (!formData._id) {
			setPublishError('Post ID is missing');
			console.error('Post ID is missing');
			return;
		}
		try {
			const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});
			const data = await res.json();
			if (!res.ok) {
				setPublishError(data.message);
				return;
			}
			if (res.ok) {
				setPublishError(null);
				navigate(`/post/${data.slug}`);
			}
		} catch (err) {
			console.log(err);
			setPublishError('something went wrong!');
		}
	};

	return (
		<div className="min-h-screen p-3 my-3 max-w-3xl mx-auto">
			<h1 className="text-center text-3xl my-7 font-semibold dark:text-white">Update Post</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 sm:flex-row justify-between">
					<TextInput
						onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
						className="flex-1"
						type="text"
						placeholder="Title"
						required
						id="title"
						value={formData.title || ''}
					/>
					<Select
						value={formData.category}
						onChange={(e) => setFormData({ ...formData, category: e.target.value })}
					>
						<option value="uncategorized">Select a category</option>
						<option value="ai">AI</option>
						<option value="dogs">Dogs</option>
						<option value="mobile">Mobile</option>
						<option value="gpu">Gpu</option>
					</Select>
				</div>
				<div className="flex gap-4 items-center justify-between border-2 border-gray-300 rounded-lg  p-3">
					<FileInput
						ref={fileInputRef}
						accept="image/*"
						onChange={(e) => setFile(e.target.files[0])}
						typeof="file"
					/>
					<button
						onClick={handleUploadImage}
						type="button"
						disabled={imageUploadProgress}
						className="!bg-gray-300 text-light-100  p-2 px-3 text-sm rounded-lg  border-gray-100 border-opacity-10 border"
					>
						{imageUploadProgress ? (
							<div className="relative w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
								<CircularProgressbar
									value={imageUploadProgress}
									text={`${imageUploadProgress || 0}%`}
									styles={{
										path: {
											stroke: `#a4a4a4` // Green for the progress path
										},
										trail: {
											stroke: '#232323' // Lighter gray for the background trail
										},
										text: {
											fill: 'currentColor', // Use Tailwind's `currentColor` to control via parent text class
											fontSize: '20px', // Adjust font size
											fontWeight: 'bold' // Make text bold
										}
									}}
								/>
								<style jsx>{`
									:global(.circular-progressbar .CircularProgressbar-text) {
										@apply text-gray-200 dark:text-gray-100;
									}
								`}</style>
							</div>
						) : (
							'Upload image'
						)}
					</button>
					{imageUploadError && (
						<Alert
							color="failure"
							className='className=" dark:!text-red-400 text-red-500 focus:ring-0 !outline-none text-xs border !border-opacity-30 !border-red-600 !bg-red-600 !bg-opacity-20 p-3  rounded-lg"'
						>
							{imageUploadError}
						</Alert>
					)}
				</div>
				<ReactQuill
					theme="snow"
					value={formData.content}
					required
					placeholder="write something comes in your mind..."
					className="h-72 mb-12 dark:text-white"
					onChange={(value) => setFormData({ ...formData, content: value })}
					ref={quillRef}
				/>
				<Button
					type="submit"
					className="focus:ring-0  !bg-gray-300 text-light-100 hover:underline border-gray-100 border-opacity-10 border"
				>
					Update
				</Button>
				{publishError && <Alert color="failure"> {publishError}</Alert>}
			</form>
		</div>
	);
}
