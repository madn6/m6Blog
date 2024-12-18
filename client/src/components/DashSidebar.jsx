import { Sidebar } from 'flowbite-react';
import { HiArrowRight, HiUser } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
export default function DashSidebar() {
	const location = useLocation();
	const [tab, setTab] = useState('');

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) {
			setTab(tabFromUrl);
    }
    
	}, [location.search]);
	return (
		<Sidebar className='w-full md:w-56 border-r-2 '>
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Sidebar.Item
						active={tab === 'profile'}
						icon={HiUser}
						label={'User'}
						labelColor={'dark'}
					>
						Profile
					</Sidebar.Item>
					<Sidebar.Item icon={HiArrowRight} className="cursor-pointer">
						Sign Out
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
