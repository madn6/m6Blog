import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
	Home,
	About,
	Dashboard,
	Projects,
	SignIn,
	SignUp,
	CreatePost,
	UpdatePost,
	Postpage,
	Search
} from './pages/index.js';
import {
	Header,
	FooterComponent,
	PrivateRoute,
	AdminPrivateRoute,
	ScrollToTop
} from './components/index.js';

export default function App() {
	return (
		<div className="w-full max-w-[1440px] mx-auto">
			<BrowserRouter>
				<ScrollToTop />
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/search" element={<Search />} />
					{/* this is private route */}
					<Route element={<PrivateRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>
					{/* this is private route for admin dashboard*/}
					<Route element={<AdminPrivateRoute />}>
						<Route path="/create-post" element={<CreatePost />} />
						<Route path="/update-post/:postId" element={<UpdatePost />} />
					</Route>
					<Route path="/projects" element={<Projects />} />
					<Route path="/post/:postSlug" element={<Postpage />} />
				</Routes>
				<FooterComponent />
			</BrowserRouter>
		</div>
	);
}
