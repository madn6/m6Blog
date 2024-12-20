import { TextInput, Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAuth, updateProfile } from 'firebase/auth';
import {  onAuthStateChanged } from 'firebase/auth';

export default function DashProfile() {
	const { currentUser } = useSelector((state) => state.user);

	const auth = getAuth();
	console.log(auth.currentUser);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log('User is signed in:', user);
			} else {
				console.log('No user is signed in.');
			}
		});
		// Cleanup subscription on component unmount
		return () => unsubscribe();
	}, []);

	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);

	const filePickerRef = useRef();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImageFileUrl(URL.createObjectURL(file));
		}
	};

	useEffect(() => {
		if (imageFile) {
			uploadImage();
		}
	}, [imageFile]);

	const uploadImage = async () => {
		if (!imageFile) return;
		try {
			const formData = new FormData();
			formData.append('file', imageFile);
			formData.append('upload_preset', 'profile_pictures');
			formData.append('folder', 'profile_pictures');
			const response = await fetch(`https://api.cloudinary.com/v1_1/dgucqdmfv/image/upload`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (data.secure_url) {
				console.log('Image uploaded:', data.secure_url);
				updateProfilePicture(data.secure_url);
				setFormData({ ...formData, profilePicture: data.secure_url });
			} else {
				console.error('Image upload failed:', data);
			}
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	const updateProfilePicture = async (imageUrl) => {
		const auth = getAuth();
		const user = auth.currentUser;
		if (user) {
			try {
				await updateProfile(user, {
					photoURL: imageUrl
				});
				console.log('Profile picture updated successfully');
			} catch (error) {
				console.error('Error updating profile picture:', error);
			}
		} else {
			console.error('No user is currently signed in.');
		}
	};

	const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData)
	};

	return (
		<div className="max-w-sm mx-auto p-3 w-full">
			<h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
			<form className="flex flex-col gap-4">
				<input
					className="hidden"
					ref={filePickerRef}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
				/>
				<div
					onClick={() => filePickerRef.current.click()}
					className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
				>
					<img
						alt="user"
						src={imageFileUrl || currentUser.profilePicture}
						className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
					/>
				</div>
				<TextInput
					type="text"
					id="username"
					placeholder="username"
					defaultValue={currentUser.username}
				/>
				<TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} />
				<TextInput type="password" id="password" placeholder="password" />
				<Button>Update</Button>
			</form>
			<div className="text-red-500 cursor-pointer flex justify-between mt-5">
				<span>Delete Account</span>
				<span>Sign Out</span>
			</div>
		</div>
	);
}
