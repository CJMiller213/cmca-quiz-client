import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // any request starting with /questions will be forwarded
      '/questions': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});