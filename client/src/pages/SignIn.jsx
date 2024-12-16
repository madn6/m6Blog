import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessge] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			return setErrorMessge('Please fill out all fields');
		}
		try {
			setLoading(true);
			setErrorMessge(null);
			const res = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			const data = await res.json();

			if (data.success === false) {
				return setErrorMessge(data.message);
			}
			setLoading(false);

			if (res.ok) {
				navigate('/');
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
							<span className="font-taruno  font-bold lg:text-3xl md:text-2xl text-xl">
								Sign in
							</span>
						</Link>
						<form onSubmit={handleSubmit} className="flex flex-col gap-2">
							<div>
								<Label value="Email" />
								<TextInput
                  type="email"
                  autoComplete='true'
									placeholder="example@gmail.com"
									id="email"
									onChange={handleChange}
								/>
							</div>
							<div>
								<Label value="Password" />
								<TextInput
									type="password"
									placeholder="Enter your password"
									id="password"
									onChange={handleChange}
								/>
							</div>
							<Button type="submit" className="focus:ring-0" disabled={loading}>
								{loading ? (
									<>
										<Spinner size="sm" />
										<span className="pl-3">Loading...</span>
									</>
								) : (
									'Sign In'
								)}
							</Button>
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
