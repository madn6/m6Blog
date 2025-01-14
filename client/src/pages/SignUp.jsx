import { Label, Button, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OAuth } from '../components';

export default function SignUp() {
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessge] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.username || !formData.email || !formData.password) {
			return setErrorMessge('Please fill out all fields');
		}
		try {
			setLoading(true);
			setErrorMessge(null);
			const res = await fetch(`/api/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials:'include',
				body: JSON.stringify(formData)
			});
			const data = await res.json();

			if (data.success === false) {
				return setErrorMessge(data.message);
			}
			setLoading(false);

			if (res.ok) {
				navigate('/sign-in');
			}
		} catch (error) {
			setErrorMessge(error.message);
			setLoading(false);
		}
	};

	return (
		<>
			<div className=" h-screen  ">
				<div className=" h-full max-w-xs mx-auto px-4  flex flex-col items-center justify-center">
					<div className="w-full ">
						<Link to="/" className=" mb-4 flex items-center justify-center">
							<span className="font-taruno  dark:text-light-100  font-bold lg:text-3xl md:text-2xl text-xl">
								Sign up
							</span>
						</Link>
						<form onSubmit={handleSubmit} className="flex flex-col gap-2">
							<div>
								<Label value="Username" className="dark:!text-light-100 text-gray-200" />
								<input
									className="block w-full focus:!ring-0 focus:border-gray-300  placeholder:text-gray-100  bg-gray-200 border-gray-300 border placeholder-gray-300 focus:!outline-none  p-3 text-sm rounded-lg text-light-100"
									type="text"
									placeholder="Enter your username"
									id="username"
									onChange={handleChange}
								/>
							</div>
							<div>
								<Label value="Email" className="dark:!text-light-100 text-gray-200" />
								<input
									className="block w-full focus:!ring-0 focus:border-gray-300  placeholder:text-gray-100  bg-gray-200 border-gray-300 border placeholder-gray-300 focus:!outline-none  p-3 text-sm rounded-lg text-light-100"
									autoComplete="true"
									type="email"
									placeholder="example@gmail.com"
									id="email"
									onChange={handleChange}
								/>
							</div>
							<div>
								<Label value="Password" className="dark:!text-light-100 text-gray-200" />
								<input
									className="block w-full focus:!ring-0 focus:border-gray-300  placeholder:text-gray-100  bg-gray-200 border-gray-300 border placeholder-gray-300 focus:!outline-none  p-3 text-sm rounded-lg text-light-100"
									autoComplete="true"
									type="password"
									placeholder="Enter your password"
									id="password"
									onChange={handleChange}
								/>
							</div>
							<Button
								type="submit"
								className="focus:ring-0 mt-4 !bg-gray-300 text-light-100 hover:underline border-gray-100 border-opacity-10 border"
								disabled={loading}
							>
								{loading ? (
									<>
										<Spinner size="sm" />
										<span className="pl-3">Loading...</span>
									</>
								) : (
									'Sign Up'
								)}
							</Button>
							<OAuth />
							<div className=" flex items-center justify-center gap-1 text-sm">
								<span>Have an account?</span>
								<Link to="/sign-in" className="text-blue-700 hover:underline">
									Sign In
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
