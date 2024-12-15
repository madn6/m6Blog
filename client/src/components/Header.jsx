import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch, AiFillMoon } from 'react-icons/ai';

export default function Header() {
	const path = useLocation().pathname;

	return (
		<Navbar className="border-b-2">
			<Link to="/">
				<span className="font-taruno  font-bold lg:text-3xl md:text-2xl text-xl">Blog</span>
			</Link>
			<form>
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline "
				/>
			</form>
			<Button className=" p-0  lg:hidden items-center" color="gray" pill>
				<AiOutlineSearch className="" />
			</Button>
			<div className="flex items-center gap-2 md:order-2">
				<Button className=" p-0 hidden sm:inline " color="gray" pill>
					<AiFillMoon />
				</Button>
				<Link to="/sign-in">
					<Button className="px-0 py-0">
						Sign In
					</Button>
				</Link>
				<Navbar.Toggle className="" />
			</div>
			{/* nav links */}
			<Navbar.Collapse>
				<Navbar.Link active={path === '/'} as={'div'}>
					<Link to="/">Home</Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/about'} as={'div'}>
					<Link to="/about">About</Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/projects'} as={'div'}>
					<Link to="/projects">Projects</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
}
