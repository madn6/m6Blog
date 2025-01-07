import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
export default function ThemeProvider({ children }) {
	const { theme } = useSelector((state) => state.theme);
	return (
		<div className={theme}>
			<div className="bg-white dark:!text-gray-100  dark:bg-dark-100 min-h-screen">
				{children}
			</div>
			<style>
				{`
					:root {
						--heading-color: #f6f6f6;
						--body-color: #a4a4a4;
					}
					h1, h2, h3, h4, h5, h6 {
						color: var(--heading-color);
					}
					body, p, span, div {
						color: var(--body-color);
					}
				`}
			</style>
		</div>
	);
}
