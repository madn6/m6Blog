import { Footer, FooterDivider } from 'flowbite-react';
import { Link } from 'react-router-dom';

import { BsFacebook, BsInstagram, BsLinkedin, BsGithub, BsDribbble } from 'react-icons/bs';

export default function FooterComponent() {
	return (
		<div>
			<Footer className=" border-t-2 shadow-none">
				<div className="w-full max-w-4xl mx-auto p-8">
					<div className="font-taruno dark:text-white flex items-center justify-center font-bold lg:text-3xl md:text-2xl text-xl">
						<Link className="" to="/">
							blogx
						</Link>
					</div>
					<div className="grid grid-cols-2 mt-4 md:place-items-center lg:place-items-center place-items-start gap-4 md:grid-cols-3 lg:grid-cols-3">
						<div className="">
							<Footer.Title title=" About" className="mb-2 text-black font-semibold" />
							<Footer.LinkGroup className="flex-col items-start">
								<Footer.Link
									href="https://mathan.pages.dev"
									target="_blank"
									rel="noopener noreferrer"
								>
									Mathan
								</Footer.Link>
								<Footer.Link href="/about" target="_blank" rel="noopener noreferrer">
									M6Blog
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div className="">
							<Footer.Title title=" Follow us" className="mb-2 text-black font-semibold" />
							<Footer.LinkGroup className="flex-col items-start">
								<Footer.Link
									href="https://mathan.pages.dev"
									target="_blank"
									rel="noopener noreferrer"
								>
									Github
								</Footer.Link>
								<Footer.Link href="#" target="_blank" rel="noopener noreferrer">
									Linked In
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div className="">
							<Footer.Title title=" Leagul" className="mb-2 text-black font-semibold" />
							<Footer.LinkGroup className="flex-col items-start">
								<Footer.Link href="#" target="_blank" rel="noopener noreferrer">
									Privacy Policy
								</Footer.Link>
								<Footer.Link href="#" target="_blank" rel="noopener noreferrer">
									Terms &amp; conditions
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
					<FooterDivider className="opacity-10" />
					<div className=" flex items-center gap-3 justify-center">
						<Footer.Copyright
							href="https://mathan.pages.dev"
							year={new Date().getFullYear()}
							by="madn6"
						/>
						<div className="flex items-center gap-1 ">
							<Footer.Icon href="#" icon={BsFacebook} />
							<Footer.Icon href="#" icon={BsInstagram} />
							<Footer.Icon href="#" icon={BsLinkedin} />
							<Footer.Icon href="#" icon={BsGithub} />
							<Footer.Icon href="#" icon={BsDribbble} />
						</div>
					</div>
				</div>
			</Footer>
		</div>
	);
}
