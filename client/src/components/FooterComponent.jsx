import { Footer, FooterDivider } from 'flowbite-react';
import { Link } from 'react-router-dom';

import { BsFacebook, BsInstagram, BsLinkedin, BsGithub } from 'react-icons/bs';

export default function FooterComponent() {
	const currentDate = new Date();
	const formattedDate = `${currentDate.toLocaleString('default', {
		month: 'short'
	})} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

	return (
		<div>
			<Footer className=" border-t-2 border-b-0 !bg-gray-200  border-gray-100  border-opacity-30 shadow-none">
				<div className="w-full max-w-4xl mx-auto p-8">
					<div className="font-taruno  !text-light-100 flex items-center justify-center font-bold lg:text-3xl md:text-2xl text-xl">
						<Link className="" to="/">
							<h1>blogx </h1>
						</Link>
					</div>
					<div className="flex items-center md:justify-center justify-between md:gap-20 my-4">
						<div className="">
							<Footer.Title title=" About" className="mb-2 !text-light-100 font-semibold" />
							<Footer.LinkGroup className="flex-col text-xs items-start">
								<Footer.Link
									className="text-gray-100 "
									href="https://mathan.pages.dev"
									target="_blank"
									rel="noopener noreferrer"
								>
									Mathan
								</Footer.Link>
								<Footer.Link
									className="text-gray-100 "
									href="/about"
									target="_blank"
									rel="noopener noreferrer"
								>
									M6Blog
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div className="">
							<Footer.Title title=" Follow us" className="mb-2    !text-light-100 font-semibold" />
							<Footer.LinkGroup className="flex-col text-xs items-start">
								<Footer.Link
									className="text-gray-100 "
									href="https://mathan.pages.dev"
									target="_blank"
									rel="noopener noreferrer"
								>
									Github
								</Footer.Link>
								<Footer.Link
									href="#"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-100 "
								>
									Linked In
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div className="">
							<Footer.Title title=" Leagul" className="mb-2  !text-light-100 font-semibold" />
							<Footer.LinkGroup className="flex-col text-xs items-start">
								<Footer.Link
									className="text-gray-100 "
									href="#"
									target="_blank"
									rel="noopener noreferrer"
								>
									Privacy Policy
								</Footer.Link>
								<Footer.Link
									className="text-gray-100 "
									href="#"
									target="_blank"
									rel="noopener noreferrer"
								>
									Terms &amp; conditions
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
					<FooterDivider className="opacity-10 !my-2 pb-1 !border-gray-100 " />
					<div className=" flex items-center text-sm  gap-3 justify-between">
						<p className="text-gray-100">{formattedDate}</p>
						<div className="copy text-gray-100">
							&copy;
							<a className="hover:underline" href="https://mathan.pages.dev/" target="_blank">
								Mdnkani
							</a>
						</div>
						<div className="flex  items-center gap-1 ">
							<Footer.Icon href="#" icon={BsFacebook} className="text-gray-100" />
							<Footer.Icon href="#" icon={BsInstagram} className="text-gray-100  " />
							<Footer.Icon href="#" icon={BsLinkedin} className="text-gray-100  " />
							<Footer.Icon href="#" icon={BsGithub} className="text-gray-100  " />
						</div>
					</div>
				</div>
			</Footer>
		</div>
	);
}
