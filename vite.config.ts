import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load correctly on GitHub Pages and sandboxed iframes
  server: {
    port: 3100,
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
