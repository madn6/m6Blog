import { Sidebar } from 'flowbite-react';
import { HiArrowRight, HiUser } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/users/userSlice';
import { useDispatch } from 'react-redux';

export default function DashSidebar() {
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
		<Sidebar className="w-full md:w-56 border-r-2 ">
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Sidebar.Item
						active={tab === 'profile'}
						icon={HiUser}
						label={'User'}
						labelColor={'dark'}
						as="div"
					>
						Profile
					</Sidebar.Item>
					<Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick={handleSignOut}>
						Sign Out
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
