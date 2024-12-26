import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TiUserDelete } from "react-icons/ti";
import { HiX, HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
	const { currentUser } = useSelector((state) => state.user);
	console.log(currentUser);

	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [userIdToDelete, setUserToDelete] = useState('');

	useEffect(() => {
		if (currentUser?.isAdmin) {
			const fetchUsers = async () => {
				try {
					const res = await fetch(`/api/user/getusers`);
					if (res.ok) {
						const data = await res.json();
						setUsers(data.users);
						if (data.users.length < 9) {
							setShowMore(false);
						}
					} else {
						console.error('Failed to fetch users:', res.statusText);
					}
				} catch (err) {
					console.error('Error fetching users:', err.message);
				}
			};
			fetchUsers();
		}
	}, [currentUser]);

	const handleShowMore = async () => {
		const startIndex = users.length;
		try {
			const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
			if (res.ok) {
				const data = await res.json();
				setUsers((prev) => [...prev, ...data.users]);
				if (data.users.length < 9) {
					setShowMore(false);
				}
			} else {
				console.error('Failed to fetch more users:', res.statusText);
			}
		} catch (err) {
			console.log('Error fetching more users:', err.message);
		}
	};

	const handleDeleteUser = async () => {
		try {
			const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
				method: 'DELETE'
			});
			const data = res.json();
			if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false)
			} else {
				console.log(data.message);
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className="table-auto lg:scrollbar-none md:scrollbar-none  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{currentUser.isAdmin && users.length > 0 ? (
				<>
					<Table hoverable className="shadow-md ">
						<Table.Head className="dark:text-white text-center ">
							<Table.HeadCell>Date created</Table.HeadCell>
							<Table.HeadCell>User image</Table.HeadCell>
							<Table.HeadCell>Username</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Admin</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						{users.map((user, i) => (
							<Table.Body key={i} className="divide-y ">
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800   ">
									<Table.Cell className="text-center">
										{new Date(user.createdAt).toLocaleDateString('en-GB')}
									</Table.Cell>
									<Table.Cell>
										<div className="flex items-center justify-center">
											<img
												src={user.profilePicture}
												alt={user.username}
												className="w-10 h-10 bg-gray-500 object-cover rounded-full"
											/>
										</div>
									</Table.Cell>
									<Table.Cell className="text-center ">{user.username}</Table.Cell>
									<Table.Cell className="text-center ">{user.email}</Table.Cell>
									<Table.Cell className="text-center">
										<div className="flex items-center justify-center ">
											{user.isAdmin ? (
												<FaCheck className="text-green-500 w-4 h-4" />
											) : (
												<FaTimes className="text-red-500 w-4 h-4" />
											)}
										</div>
									</Table.Cell>
									<Table.Cell>
										<span className="flex items-center justify-center">
											<TiUserDelete
												onClick={() => {
													setShowModal(true);
													setUserToDelete(user._id);
												}}
												className="text-red-600   hover:scale-110 cursor-pointer w-5 h-5"
											/>
										</span>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMore && (
						<button
							onClick={handleShowMore}
							className="w-full text-teal-500 self-center text-sm py-7"
						>
							Show more...
						</button>
					)}
				</>
			) : (
				<p>You have not users yet!</p>
			)}
			<Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
				<span
					onClick={() => setShowModal(false)}
					className="flex  items-center justify-end p-2 cursor-pointer"
				>
					<HiX className="hover:scale-110 h-5 w-5 transition-all duration-150" />
				</span>
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
						<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to delete this user?
						</h3>
						<div className="flex justify-center  gap-4">
							<Button color="failure" onClick={handleDeleteUser}>
								{"Yes, I'm sure"}
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
