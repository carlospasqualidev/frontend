import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), checker({ typescript: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Separa as libs maiores em chunks próprios para melhorar o cache
        // (uma mudança no app não invalida o bundle do React/Radix/etc.).
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'react-vendor';
          }

          if (id.includes('@tanstack')) {
            return 'tanstack';
          }

          if (id.includes('radix-ui') || id.includes('@radix-ui')) {
            return 'radix';
          }

          return 'vendor';
        },
      },
    },
  },
});
