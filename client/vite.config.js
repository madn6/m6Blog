import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000', // Backend server
				secure: false,
			}
		},
		host: true, // Allows access from your local network
		port: 5173 // Default port for Vite
	},
	build: {
		chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
		outDir: 'dist' // Ensure this matches your deployment settings
	},
	plugins: [react()]
});
