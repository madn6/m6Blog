import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiFillMoon, AiFillSun, AiOutlineMenu } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/users/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
	const { theme } = useSelector((state) => state.theme);
	const path = useLocation().pathname;
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	const [searchTerm, setSearchTerm] = useState('');
	const [open, setOpen] = useState(false);

	const toggleMenu = () => {
		setOpen(!open);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm');
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, [location.search]);

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

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set('searchTerm', searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	return (
		<Navbar className="custom-navbar  dark:!bg-dark-100">
			<Link to="/">
				<span className="font-taruno  font-bold lg:text-3xl md:text-2xl text-xl dark:text-light-100 text-gray-200">
					Blogx
				</span>
			</Link>
			<form onSubmit={handleSubmit}>
				<div className="relative flex  items-center">
					<input
						type="text"
						value={searchTerm}
						placeholder="Search..."
						className=" w-full p-2 hidden md:inline bg-gray-200   text-[#a4a4a4] placeholder-[#a4a4a4] rounded-md border-none focus:ring-0 focus:outline-none"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<AiOutlineSearch className="absolute  hidden md:inline right-3 text-[#a4a4a4]" />
				</div>
			</form>
			<div className="flex items-center gap-2 md:order-2 ">
				<button
					className="  px-2 py-2 text-xl border-gray-300 border rounded-sm bg-gray-200 text-light-100  border-opacity-50"
					onClick={() => dispatch(toggleTheme())}
				>
					{theme === 'light' ? <AiFillMoon /> : <AiFillSun />}
				</button>
				{currentUser ? (
					<Dropdown
						className="!bg-dark-300 "
						arrowIcon={false}
						inline
						label={<Avatar alt="Avatar" className="" img={currentUser.profilePicture} rounded />}
					>
						<Dropdown.Header className="">
							<span className="block text-sm !text-light-100">{currentUser.username}</span>
							<span className="block text-sm font-medium truncate !text-light-100 ">{currentUser.email}</span>
						</Dropdown.Header>
						<Link to="/dashboard?tab=profile" className="hover:!bg-gray-200">
							<Dropdown.Item className="hover:!bg-gray-200  rounded-sm">
								<span className="!text-light-100">Profile</span>
							</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignOut} className=" hover:!bg-gray-200  rounded-sm">
							<span className="!text-light-100 ">Sign out</span>
						</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in" className="">
						<button className="bg-gray-200 text-sm border-gray-300 border text-light-100 border-opacity-50  px-2 py-2  rounded-sm">
							Sign In
						</button>
					</Link>
				)}
				<div className="bg-gray-200 md:hidden lg:hidden  border-gray-300 border !text-light-100 border-opacity-50   px-2 py-2 rounded-sm">
					<AiOutlineMenu onClick={toggleMenu} className="text-xl cursor-pointer" />
				</div>
			</div>
			{/* nav links */}
			<div
				className={`fixed inset-0 z-50 bg-dark-100 transition-transform duration-500 ease-in-out 
            ${open ? 'translate-y-0' : ' -translate-y-full'} 
            sm:block md:hidden`} 
			>
				<div className="flex flex-col h-full items-center justify-center text-5xl space-y-10 text-center">
					<div
						className={`block py-2 !p-4 pl-3 rounded-sm pr-4 md:p-0 ${
							path === '/'
								? 'text-[#f6f6f6] bg-gray-200 !border-gray-300 !border'
								: 'text-[#a4a4a4] '
						} hover:text-[#f6f6f6] hover:bg-gray-200`}
					>
						<Link className="" to="/" onClick={() => setOpen(false)}>
							Home
						</Link>
					</div>
					<div
						className={`block py-2 pl-3 rounded-sm pr-4 md:p-0 ${
							path === '/about'
								? 'text-[#f6f6f6] bg-gray-200 border-gray-300 border'
								: 'text-[#a4a4a4]'
						} hover:text-[#f6f6f6] hover:bg-gray-200`}
					>
						<Link to="/about" onClick={() => setOpen(false)}>
							About
						</Link>
					</div>
					<div
						className={`block py-2 pl-3 rounded-sm pr-4 md:p-0 ${
							path === '/projects'
								? 'text-[#f6f6f6] bg-gray-200 border-gray-300 border'
								: 'text-[#a4a4a4]'
						} hover:text-[#f6f6f6] hover:bg-gray-200`}
					>
						<Link to="/projects" onClick={() => setOpen(false)}>
							Projects
						</Link>
					</div>
				</div>
			</div>

			{/* For medium and large screens */}
			<div className="hidden md:flex md:flex-row md:space-x-1 md:text-sm md:font-medium lg:flex lg:space-x-2 lg:text-sm lg:font-medium">
				<div
					className={`block py-2 pl-3 rounded-sm pr-4  ${
						path === '/' ? 'text-[#f6f6f6]   bg-gray-200  border-gray-300 border' : 'dark:text-[#a4a4a4] text-gray-200'
					} dark:hover:text-[#f6f6f6] dark:hover:bg-gray-200 hover:bg-gray-200 hover:text-light-100`}
				>
					<Link to="/" onClick={() => setOpen(false)}>
						Home
					</Link>
				</div>
				<div
					className={`block py-2 pl-3 rounded-sm pr-4 ${
						path === '/about'
							? 'text-[#f6f6f6] bg-gray-200 border-gray-300 border'
							: 'dark:text-[#a4a4a4] text-gray-200 '
					} dark:hover:text-[#f6f6f6] dark:hover:bg-gray-200 hover:bg-gray-200 hover:text-light-100`}
				>
					<Link to="/about" onClick={() => setOpen(false)}>
						About
					</Link>
				</div>
				<div
					className={`block py-2 pl-3 rounded-sm pr-4  ${
						path === '/projects'
							? 'text-[#f6f6f6] bg-gray-200 border-gray-300 border '
							: 'dark:text-[#a4a4a4] text-gray-200'
					} dark:hover:text-[#f6f6f6] dark:hover:bg-gray-200 hover:bg-gray-200 hover:text-light-100`}
				>
					<Link to="/projects" onClick={() => setOpen(false)}>
						Projects
					</Link>
				</div>
			</div>
		</Navbar>
	);
}
