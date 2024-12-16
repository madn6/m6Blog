import { Label, TextInput, Button, Alert, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
			const res = await fetch('/api/auth/signup', {
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
							<span className="font-taruno  font-bold lg:text-3xl md:text-2xl text-xl">
								Sign up
							</span>
						</Link>
						<form onSubmit={handleSubmit} className="flex flex-col gap-2">
							<div>
								<Label value="Username" />
								<TextInput
									type="text"
									placeholder="Enter your username"
									id="username"
									onChange={handleChange}
								/>
							</div>
							<div>
								<Label value="Email" />
								<TextInput
									type="email"
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
									'Sign Up'
								)}
							</Button>
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
