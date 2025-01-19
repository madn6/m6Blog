import {
	HiAnnotation,
	HiArrowRight,
	HiChartPie,
	HiDocumentText,
	HiOutlineUserGroup,
	HiUser
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/users/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
	const { currentUser } = useSelector((state) => state.user);

	const location = useLocation();
	const [tab, setTab] = useState('');

	const dispatch = useDispatch();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) {
			setTab(tabFromUrl);
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

	return (
		<div className="w-full h-full md:w-56 md:border-r border-gray-200 border-b">
			<div className="">
				<div className="flex flex-col  gap-2 p-2">
					<div className="">
						<Link
							to="/dashboard?tab=profile"
							className={`flex items-center  justify-between p-2 rounded ${
								tab === 'profile'
									? 'bg-gray-200 text-light-100 dark:bg-gray-200 dark:text-light-100 '
									: ''
							} hover:bg-gray-200 hover:text-light-100 dark:hover:bg-gray-200   dark:hover:text-light-100`}
						>
							<div className="flex p-1   items-center gap-2">
								<HiUser className={`w-6 h-6  ${tab === 'profile' ? 'text-light-100 ' : ''}`} />
								<div>Profile</div>
							</div>
							<span
								className={`${
									tab === 'profile'
										? 'text-light-100 bg-dark-100   p-1 text-xs px-2 rounded-md'
										: 'bg-gray-200 text-light-100 rounded-md '
								} p-1 text-xs px-2 rounded-lg`}
							>
								{currentUser.isAdmin ? 'Admin' : 'User'}
							</span>
						</Link>
					</div>
					{currentUser.isAdmin && (
						<Link
							to="/dashboard?tab=posts"
							className={`flex items-center gap-2 p-2 rounded ${
								tab === 'posts'
									? 'bg-gray-200 text-light-100 dark:bg-gray-200 dark:text-light-100'
									: ''
							} hover:bg-gray-200 hover:text-light-100 dark:hover:bg-gray-200   dark:hover:text-light-100`}
						>
							<div className={`p-1 rounded ${tab === 'posts' ? '' : ''}`}>
								<HiDocumentText
									className={`w-6 h-6 ${tab === 'posts' ? 'text-light-100' : 'dark:text-gray-100'}`}
								/>
							</div>
							<div>Posts</div>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link
							to="/dashboard?tab=users"
							className={`flex items-center gap-2 p-2 rounded ${
								tab === 'users'
									? 'bg-gray-200 text-light-100 dark:bg-gray-200 dark:text-light-100'
									: ''
							} hover:bg-gray-200 hover:text-light-100 dark:hover:bg-gray-200 dark:hover:text-light-100`}
						>
							<div className={`p-1 rounded ${tab === 'users' ? '' : ''}`}>
								<HiOutlineUserGroup
									className={`w-6 h-6 ${tab === 'users' ? 'text-light-100' : 'dark:text-gray-100'}`}
								/>
							</div>
							<div>Users</div>
						</Link>
					)}

					{currentUser.isAdmin && (
						<Link
							to="/dashboard?tab=comments"
							className={`flex items-center gap-2 p-2 rounded ${
								tab === 'comments'
									? 'bg-gray-200 text-light-100 dark:bg-gray-200 dark:text-light-100'
									: ''
							} hover:bg-gray-200 hover:text-light-100 dark:hover:bg-gray-200 dark:hover:text-light-100`}
						>
							<div className={`p-1 rounded  ${tab === 'comments' ? '' : ''}`}>
								<HiAnnotation
									className={` w-6 h-6 ${
										tab === 'comments' ? 'text-light-100' : 'dark:text-gray-100'
									}`}
								/>
							</div>
							<div>Comments</div>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link
							to="/dashboard?tab=dash"
							className={`flex items-center gap-2 p-2 rounded ${
								tab === 'dash' || !tab
									? 'bg-gray-200 text-light-100 dark:bg-gray-200 dark:text-light-100'
									: ''
							} hover:bg-gray-200 hover:text-light-100 dark:hover:bg-gray-200 dark:hover:text-light-100`}
						>
							<div className={`p-1 rounded ${tab === 'dash' || !tab ? '' : ''}`}>
								<HiChartPie
									className={`w-6 h-6 ${
										tab === 'dash' || !tab ? 'text-light-100' : 'dark:text-gray-100'
									}`}
								/>
							</div>
							<div>Dashboard</div>
						</Link>
					)}

					<div
						className="flex items-center gap-2 p-2 rounded hover:text-light-100  cursor-pointer dark:text-light-100 hover:bg-gray-200 dark:hover:bg-gray-200"
						onClick={handleSignOut}
					>
						<div className="p-1 rounded">
							<HiArrowRight className="dark:text-gray-100 w-6 h-6" />
						</div>
						Sign Out
					</div>
				</div>
			</div>
		</div>
	);
}
