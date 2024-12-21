import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, About, Dashboard, Projects, SignIn, SignUp,CreatePost } from './pages/index.js';
import { Header, FooterComponent, PrivateRoute, AdminPrivateRoute, } from './components/index.js';

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				{/* this is private route */}
				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
				{/* this is private route for admin dashboard*/}
				<Route element={<AdminPrivateRoute />}>
					<Route path="/create-post" element={<CreatePost />} />
				</Route>
				<Route path="/projects" element={<Projects />} />
			</Routes>
			<FooterComponent />
		</BrowserRouter>
	);
}
