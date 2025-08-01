import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  optimizeDeps: {
    exclude: ['/script.js']
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        causes: resolve(__dirname, 'causes.html'),
        achievements: resolve(__dirname, 'achievements.html'),
        donate: resolve(__dirname, 'donate.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});