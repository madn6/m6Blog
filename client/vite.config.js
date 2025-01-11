import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'https://m6blog.onrender.com',
				secure: false
			}
		},
		build: {
			chunkSizeWarningLimit: 1000 // Set limit in KB (default is 500 KB)
		},
		host: true, // This allows access from your network
		port: 5173 // Optional: Specify a custom port
	},
	plugins: [react()]
});
