import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch, AiFillMoon, AiFillSun } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/users/userSlice';

export default function Header() {
	const path = useLocation().pathname;
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);
	console.log('this is from header current user', currentUser);
	

		const handleSignOut = async () => {
			try {
				const res = await fetch('/api/user/signout', {
					method: 'POST'
				});
				const data = res.json();
				if (!res.ok) {
					console.log(data.message);
				} else {
					dispatch(signoutSuccess());
				}
			} catch (err) {
				console.log(err.message);
			}
	};
	

	const { theme } = useSelector((state) => state.theme);
	return (
		<Navbar className="border-b-2">
			<Link to="/">
				<span className="font-taruno  font-bold lg:text-3xl md:text-2xl text-xl dark:text-white">Blogx</span>
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
				<Button
					className=" p-0 hidden sm:inline "
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}
				>
					{theme === 'light' ? <AiFillMoon /> : <AiFillSun />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar
								alt="Avatar"
								img={currentUser.profilePicture}
								rounded
							/>
						}
					>
						<Dropdown.Header>
							<span className="block text-sm">{currentUser.username}</span>
							<span className="block text-sm font-medium truncate">{currentUser.email}</span>
						</Dropdown.Header>
						<Link to="/dashboard?tab=profile">
							<Dropdown.Item>Profile</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in">
						<Button>Sign In</Button>
					</Link>
				)}
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
