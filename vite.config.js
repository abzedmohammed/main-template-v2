import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
		host: '0.0.0.0', // Allows external access
		port: 5173, // Ensure the port matches
		strictPort: true, // Ensures the app uses the specified port
	},
})
