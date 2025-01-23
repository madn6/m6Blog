import { useSelector } from 'react-redux';

export default function About() {
	const theme = useSelector((state) => state.theme.theme); // Access current theme from Redux

	return (
		<div className="min-h-screen md:p-6 p-4">
			<div className="text-center font-medium dark:text-light-100 lg:text-5xl md:text-3xl text-xl">About this Blog</div>
			<div className="flex items-center justify-center">
				<img
					className="lg:max-w-[900px] md:max-w-[600px] max-w-[400px]"
					src={theme === 'light' ? '/images/logic-chart.webp' : '/images/logic-chart1.webp'}
					alt="Logic chart"
				/>
			</div>
		</div>
	);
}
