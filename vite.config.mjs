import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [ react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'hooks': path.resolve(__dirname, './src/hooks'),
      'utils': path.resolve(__dirname, './src/utils'),
      'config': path.resolve(__dirname, './src/config'),
      'pages': path.resolve(__dirname, './src/pages'),
      'helper': path.resolve(__dirname, './src/helper'),
      'models': path.resolve(__dirname, './src/models'),
      'context': path.resolve(__dirname, './src/context'),
      'images': path.resolve(__dirname, './src/images'),
      'components': path.resolve(__dirname, './src/components'),
      'styles': path.resolve(__dirname, './src/styles'),
      'api': path.resolve(__dirname, './src/api'),

    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
  build: {
    sourcemap: mode === 'development',
  },
}));