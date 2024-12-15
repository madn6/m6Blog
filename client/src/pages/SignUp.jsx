import { Label, TextInput, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function SignUp() {
	return (
		<>
			<div className="max-w-xs mx-auto h-full mt-32">
				<Link to="/" className=' mb-4 flex items-center justify-center'>
					<span className="font-taruno  font-bold lg:text-3xl md:text-2xl text-xl">Blog</span>
				</Link>
				<form className="flex flex-col gap-2">
					<div>
						<Label value="Username" />
						<TextInput type="text" placeholder="Enter your username" id="username" />
					</div>
					<div>
						<Label value="Email" />
						<TextInput type="text" placeholder="example@gmail.com" id="email" />
					</div>
					<div>
						<Label value="Password" />
						<TextInput type="text" placeholder="Enter your password" id="password" />
          </div>
					<Button type="submit">Sign Up</Button>
					<div className=" flex items-center justify-center gap-1 text-sm">
						<span>Have an account?</span>
						<Link to="/sign-in" className="text-blue-700 hover:underline">
							Sign In
						</Link>
					</div>
				</form>
			</div>
		</>
	);
}
