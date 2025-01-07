import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				secure: false
			}
		},
		host: true, // This allows access from your network
		port: 5173 // Optional: Specify a custom port
	},
	plugins: [react()]
});
