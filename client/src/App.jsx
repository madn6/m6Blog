import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, About, Dashboard, Projects, SignIn, SignUp } from './pages/index.js';
import { Header } from './components/index.js';

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/projects" element={<Projects />} />
			</Routes>
		</BrowserRouter>
	);
}
