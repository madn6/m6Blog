import { Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TiUserDelete } from 'react-icons/ti';
import { HiX, HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Spinner } from 'flowbite-react';

export default function DashUsers() {
	const { currentUser } = useSelector((state) => state.user);
	console.log(currentUser);

	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [userIdToDelete, setUserToDelete] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (currentUser?.isAdmin) {
			const fetchUsers = async () => {
				try {
					const res = await fetch(`/api/user/getusers`, {
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json'
						}
					});
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
				} finally {
					setLoading(false); //  loading is false regardless of success or error
				}
			};
			fetchUsers();
		} else {
			setLoading(false); // If the user is not admin, stop loading
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
				method: 'DELETE',
				credentials: 'include'
			});
			const data = res.json();
			if (res.ok) {
				setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
				setShowModal(false);
			} else {
				console.log(data.message);
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	console.log('users:', users);

	return (
		<div className="table-auto my-3 min-h-screen overflow-x-auto md:mx-auto p-3 scrollbar-hide">
			{loading ? (
				<div className="flex justify-center items-center mt-12">
					<Spinner color="gray" size="md" />
				</div>
			) : currentUser.isAdmin && users.length > 0 ? (
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
								<Table.Row className=" dark:bg-gray-200 dark:hover:!bg-gray-300 dark:hover:!bg-opacity-30   hover:!bg-gray-300 hover:!bg-opacity-10 dark:!text-gray-100 text-gray-200 ">
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
									<Table.Cell className="text-center dark:text-light-100">
										{user.username}
									</Table.Cell>
									<Table.Cell className="text-center ">{user.email}</Table.Cell>
									<Table.Cell className="text-center">
										<div className="flex items-center justify-center ">
											{user.isAdmin ? (
												<>
													<span className=''>
														<FaCheck className="text-green-500    w-4 h-4" />
													</span>
												</>
											) : (
												<>
													<span className="">
														<FaTimes className="text-red-500  w-4 h-4" />
													</span>
												</>
											)}
										</div>
									</Table.Cell>
									<Table.Cell>
										<span className="flex items-center justify-center" >
											<span className='text-red-400 focus:ring-0 outline-none text-xs border border-opacity-30 border-red-600 bg-red-600 bg-opacity-20 p-2  rounded-md'>
											<TiUserDelete
												onClick={() => {
													setShowModal(true);
													setUserToDelete(user._id);
												}}
												className="text-red-400  hover:scale-110 cursor-pointer w-5 h-5"
											/>
											</span>
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
				<p>You have no users yet!</p>
			)}

			<Modal
				className="bg-black  bg-opacity-50 overflow-hidden"
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				size="md"
			>
				<span
					onClick={() => setShowModal(false)}
					className="flex bg-gray-200  rounded-tl-md rounded-tr-md border-gray-100 border-opacity-10 border border-b-0   items-center justify-end p-2 cursor-pointer"
				>
					<HiX className="hover:scale-110 h-5 w-5 text-gray-100 transition-all duration-150" />
				</span>
				<Modal.Body className="!bg-gray-200 border-gray-100 border-opacity-10  rounded-bl-md rounded-br-md  border border-t-0">
					<div className="text-center">
						<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 " />
						<h3 className="mb-5  font-normal !text-gray-100 ">
							Are you sure you want to delete your account?
						</h3>
						<div className="flex mt-3 justify-center  gap-4">
							<button
								className="text-red-400 focus:ring-0 outline-none text-xs border border-opacity-30 border-red-600 bg-red-600 bg-opacity-20 p-3  rounded-lg"
								onClick={handleDeleteUser}
							>
								{"Yes, I'm sure"}
							</button>
							<button
								className="text-green-400 text-xs focus:ring-0 outline-none border border-opacity-30 border-green-600 bg-green-600 bg-opacity-20 p-3  rounded-lg"
								onClick={() => setShowModal(false)}
							>
								No, cancel
							</button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
