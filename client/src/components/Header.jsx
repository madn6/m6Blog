import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch, AiFillMoon } from 'react-icons/ai';
import { useSelector } from 'react-redux';

export default function Header() {
	const path = useLocation().pathname;
	const { currentUser } = useSelector((state) => state.user);
	console.log('this is current user', currentUser);
	return (
		<Navbar className="border-b-2">
			<Link to="/">
				<span className="font-taruno  font-bold lg:text-3xl md:text-2xl text-xl">Blogx</span>
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
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={<Avatar alt="Avatar" img={currentUser.profilePicture} rounded />}
					>
						<Dropdown.Header>
							<span className="block text-sm">{currentUser.username}</span>
							<span className="block text-sm font-medium truncate">{currentUser.email}</span>
						</Dropdown.Header>
						<Link to="/dashboard?tab=profile">
							<Dropdown.Item>Profile</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item>Sign out</Dropdown.Item>
					</Dropdown>
				) : (
					<Avatar
						alt="Avatar"
						img={`/proxy?url=${encodeURIComponent(currentUser.profilePicture)}`}
						rounded
					/>
					// <Link to="/sign-in">
					// 	<Button className="px-0 py-0 focus:ring-0">Sign In</Button>
					// </Link>
				)}
				{/* <img src={currentUser.profilePicture} alt="avatar" /> */}
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
