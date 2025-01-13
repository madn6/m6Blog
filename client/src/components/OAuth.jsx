import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInsuccess } from '../redux/users/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
	const auth = getAuth(app);
	const dispatch = useDispatch();
	const naviagate = useNavigate();


	const handleGoogleClick = async () => {
		const provider = new GoogleAuthProvider();

		provider.setCustomParameters({ prompt: 'select_account' });
		try {
			const resultFromGoogle = await signInWithPopup(auth, provider);
			const res = await fetch(`/api/auth/google`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: resultFromGoogle.user.displayName,
					email: resultFromGoogle.user.email,
					googlePhotoUrl: resultFromGoogle.user.photoURL
				})
			});
			const data = await res.json();
			console.log('data', data);
			if (res.ok) {
				dispatch(signInsuccess(data));
				naviagate('/');
			}
		} catch (err) {
			console.error('Error during Google sign-in:', err);
		}
	};
	return (
		<>
			<Button
				onClick={handleGoogleClick}
				type="button"
				className="focus:ring-0  !bg-gray-300 text-light-100 hover:underline border-gray-100 border-opacity-10 border"
			>
				<AiFillGoogleCircle className="mr-2 w-5 h-5 " />
				Continue With Google
			</Button>
		</>
	);
}
