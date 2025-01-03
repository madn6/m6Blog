import { FileInput, Select, TextInput, Button, Alert } from 'flowbite-react';
import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate}from 'react-router-dom'

export default function CreatePost() {
	const [file, setFile] = useState(null);
	const [formData, setFormData] = useState({});
	const [publishError, setPublishError] = useState(null);
	console.log(formData);

	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadError, setImageUploadError] = useState(null);

	const quillRef = useRef(null);
	const fileInputRef = useRef(null);
	const navigate = useNavigate()

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

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch('/api/post/create', {
				method: 'POST',
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
				navigate(`/post/${data.slug}`)
			}
		} catch (err) {
			console.log(err);
			setPublishError('something went wrong!');
		}
	};

	return (
		<div className="min-h-screen p-3 max-w-3xl mx-auto">
			<h1 className="text-center text-3xl my-7 font-semibold dark:text-white">Create Post</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 sm:flex-row justify-between">
					<TextInput
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						className="flex-1 "
						type="text"
						placeholder="Title"
						required
						id="title"
					/>
					<Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
						<option value="uncategorized">Select a category</option>
						<option value="ai">AI</option>
						<option value="dogs">Dogs</option>
						<option value="mobile">Mobile</option>
						<option value="gpu">Gpu</option>
					</Select>
				</div>
				<div className="flex gap-4 items-center justify-between border-4 border-dotted p-3">
					<FileInput
						ref={fileInputRef}
						accept="image/*"
						onChange={(e) => setFile(e.target.files[0])}
						typeof="file"
					/>
					<Button
						onClick={handleUploadImage}
						type="button"
						size="sm"
						outline
						disabled={imageUploadProgress}
					>
						{imageUploadProgress ? (
							<div className="w-16 h-16">
								<CircularProgressbar
									value={imageUploadProgress}
									text={`${imageUploadProgress || 0}`}
								></CircularProgressbar>
							</div>
						) : (
							'Upload image'
						)}
					</Button>
					{imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
				</div>
				<ReactQuill
					theme="snow"
					required
					placeholder="write something comes in your mind..."
					className="h-72 mb-12 dark:text-white text__editor"
					onChange={(value) => setFormData({ ...formData, content: value })}
					ref={quillRef}
				/>
				<Button type="submit">Publish</Button>
				{publishError && <Alert color="failure"> {publishError}</Alert>}
			</form>
		</div>
	);
}
