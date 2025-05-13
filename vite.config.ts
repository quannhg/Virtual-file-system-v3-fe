import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 30012,
    strictPort: true
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
  preview: {
    port: 30012,
    strictPort: true
  },
});
