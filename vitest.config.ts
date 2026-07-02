import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Config dedicada de testes (separada do vite.config.ts para não carregar
// o vite-plugin-checker durante a execução da suíte).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    // Vitest cobre só unidade/integração em src/tests/ (`.test.ts(x)`).
    // Os specs `.spec.ts` de `e2e/` são do Playwright — sem isso o Vitest os
    // capturaria pelo glob default e quebraria no `test.describe()`.
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
