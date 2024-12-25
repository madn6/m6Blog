import { TextInput, Button, Modal, Alert } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAuth, updateProfile, deleteUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
	updateStart,
	updateSuccess,
	updateFailure,
	deleteStart,
	deleteSuccess,
	deleteFailure,
	signoutSuccess
} from '../redux/users/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
	const { currentUser, error, loading } = useSelector((state) => state.user);

	const auth = getAuth();

	const dispatch = useDispatch();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log('User is signed in');
			} else {
				console.log('No user is signed in.');
			}
		});
		// Cleanup subscription on component unmount
		return () => unsubscribe();
	}, [auth]);

	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [formData, setFormData] = useState({});
	const [showModal, setShowModal] = useState(false);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		console.log('This is auth current user:', user);
		if (user) {
			try {
				if (imageUrl) {
					// If imageUrl is provided, update the profile picture with the new image
					await updateProfile(user, { photoURL: imageUrl });
					console.log('Profile picture updated successfully');
				} else {
					// If imageUrl is null, reset to the default Gmail profile picture
					await updateProfile(user, { photoURL: null });
					console.log('Profile picture reset to default Gmail profile picture');
				}
				// Wait for the user profile to be reloaded
				await user.reload();
				// After reloading, fetch the updated user profile and log the photoURL
				const updatedUser = auth.currentUser;
				console.log('Updated user photoURL:', updatedUser.photoURL);
				// If the photoURL is still not null, force log out and log back in to reset
				if (updatedUser.photoURL) {
					console.log('Photo URL still set, forcing log out...');
					await auth.signOut(); // Sign out the user
					console.log('User logged out');
					// After logging out, clear localStorage and sessionStorage
					localStorage.clear();
					sessionStorage.clear();
					// Redirect or ask the user to log in again
					// window.location.reload(); // Uncomment if you want to reload the page
				}
			} catch (error) {
				console.error('Error updating profile picture:', error);
			}
		} else {
			console.error('No user is currently signed in.');
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (Object.keys(formData).length === 0) {
			return;
		}
		try {
			dispatch(updateStart());
			// Optimistic update
			// const optimisticUser = { ...currentUser, ...formData };
			// dispatch(updateSuccess(optimisticUser));
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});
			if (!res.ok) {
				const errorData = await res.json();
				dispatch(updateFailure(errorData.message));
				return; // Revert optimistic update in the reducer (optional)
			}
			const data = await res.json();
			dispatch(updateSuccess(data)); // Final update with backend response
		} catch (err) {
			dispatch(updateFailure(err.message)); // Revert optimistic update (optional)
		}
	};

	const handleDeleteUser = async () => {
		setShowModal(false);
		const auth = getAuth();
		const user = auth.currentUser;

		try {
			dispatch(deleteStart());

			// Delete user from your database
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentUser.token}`
				}
			});

			const data = await res.json();

			if (!res.ok) {
				dispatch(deleteFailure(data.message || 'Failed to delete user'));
			} else {
				console.log(data.message);

				// Step 1: Delete the user from Firebase Authentication
				if (user) {
					await deleteUser(user); // Deletes user from Firebase Authentication
					console.log('User deleted from Firebase Authentication');
				} else {
					console.error('No user is signed in');
				}

				// Step 2: Clear local and session storage
				dispatch(deleteSuccess());
				localStorage.clear();
				sessionStorage.clear();
				window.location.reload();
			}
		} catch (err) {
			console.error('Error deleting user:', err.message);
			dispatch(deleteFailure(err.message));
		}
	};

	const handleSignOut = async () => {
		try {
			const res = await fetch('/api/user/signout', {
				method: 'POST'
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signoutSuccess());
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className="max-w-sm mx-auto p-3 w-full">
			<h1 className="my-7 text-center font-semibold text-3xl  dark:text-white">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
					onChange={handleChange}
				/>
				<TextInput
					type="email"
					id="email"
					placeholder="email"
					defaultValue={currentUser.email}
					onChange={handleChange}
				/>
				<TextInput
					type="password"
					id="password"
					placeholder="password"
					autoComplete="false"
					onChange={handleChange}
				/>
				<Button
					type="submit"
					disabled={loading} // Disable button only during form submission
					className={`mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
				>
					{loading ? 'Submitting...' : 'Update'} {/* Dynamic button text */}
				</Button>
				{currentUser.isAdmin && (
					<Link to={'/create-post'}>
						<Button type="button" className="w-full">
							Create a Post
						</Button>
					</Link>
				)}
			</form>
			<div className="text-red-500 text-sm font-regular cursor-pointer flex justify-between mt-5">
				<span onClick={() => setShowModal(true)}>Delete Account</span>
				<span onClick={handleSignOut}>Sign Out</span>
			</div>
			{error && (
				<Alert color="failure" className="mt-5">
					{error}
				</Alert>
			)}
			<Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
				<span
					onClick={() => setShowModal(false)}
					className="flex  items-center justify-end p-2 cursor-pointer"
				>
					<HiX className="hover:scale-110 h-5 w-5 transition-all duration-150" />
				</span>
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
						<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete your account?
						</h3>
						<div className="flex justify-center  gap-4">
							<Button color="failure" onClick={handleDeleteUser}>
								{"Yes, I'm sure"}
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
