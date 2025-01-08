import { Label,  Button, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { signInStart, signInsuccess, signInFailure } from '../redux/users/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { OAuth } from '../components';

export default function SignIn() {
	const [formData, setFormData] = useState({});
	const { loading, error: errorMessage } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			dispatch(signInFailure('Please fill out all fields'));
		}
		try {
			dispatch(signInStart());
			const res = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			const data = await res.json();

			if (data.success === false) {
				dispatch(signInFailure(data.message));
			}
			if (res.ok) {
				dispatch(signInsuccess(data));
				navigate('/');
			}
		} catch (error) {
			dispatch(error.message);
		}
	};

	return (
		<>
			<div className=" h-screen  ">
				<div className=" h-full  max-w-xs mx-auto px-4  flex flex-col items-center  justify-center">
					<div className="w-full ">
						<Link to="/" className=" mb-4 flex items-center justify-center">
							<span className="font-taruno dark:text-light-100  font-bold lg:text-3xl md:text-2xl text-xl">
								Sign in
							</span>
						</Link>
						<form onSubmit={handleSubmit} className="flex flex-col gap-2">
							<div>
								<Label value="Email" className="dark:!text-light-100 text-gray-200" />
									<input
										className="block w-full focus:ring-0 placeholder:text-gray-100  bg-gray-200 border-gray-300 focus:border-gray-300 border placeholder-gray-300 focus:outline-none  p-4 md:p-3 text-sm rounded-lg text-light-100"
										type="email"
										autoComplete="true"
										id="email"
										onChange={handleChange}
										placeholder="example@gmail.com"
									/>
							</div>
							<div> 
								<Label value="Password" className="dark:text-light-100  text-gray-200" />
								<input
									className="block w-full focus:!ring-0 focus:border-gray-300  placeholder:text-gray-100  bg-gray-200 border-gray-300 border placeholder-gray-300 focus:!outline-none  p-4 md:p-3 text-sm rounded-lg text-light-100"
									type="password"
									autoComplete="true"
									placeholder="Enter your password"
									id="password"
									onChange={handleChange}
								/>
							</div>
							<Button type="submit" className="focus:ring-0 mt-4 !bg-gray-300 text-light-100 hover:underline border-gray-100 border-opacity-10 border" disabled={loading}>
								{loading ? (
									<>
										<Spinner size="sm" />
										<span className="pl-3">Loading...</span>
									</>
								) : (
									'Sign In'
								)}
							</Button>
							<OAuth />
							<div className=" flex items-center justify-center gap-1 text-sm">
								<span>Have an account?</span>
								<Link to="/sign-up" className="text-blue-700 hover:underline">
									Sign Up
								</Link>
							</div>
							{errorMessage && <Alert color="failure">{errorMessage}</Alert>}
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
