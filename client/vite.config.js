import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
	const isProduction = mode === 'production';

	return {
		base: isProduction ? '/your-production-base/' : '/',
		build: {
			chunkSizeWarningLimit: 1000,
			outDir: 'dist' // Ensure this matches your deployment needs
		},
		server: {
			proxy: !isProduction
				? {
						'/api': {
							target: 'http://localhost:3000',
							secure: false,
							changeOrigin: true
						}
				}
				: undefined,
			host: true,
			port: 5173
		},
		plugins: [react()]
	};
});
