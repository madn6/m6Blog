import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DashComments, DashProfile, DashSidebar, DashUsers } from '../components';
import DashPost from '../components/DashPost';

export default function Dashborad() {
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
		<div className="min-h-screen  flex flex-col md:flex-row">
			{/* sidebar */}
			<div className="md:w-56">
				<DashSidebar />
			</div>
			{/* profile */}
			{tab === 'profile' && <DashProfile />}
			{tab === 'posts' && <DashPost />}
			{tab === 'users' && <DashUsers />}
			{tab === 'comments' && <DashComments />}
		</div>
	);
}
