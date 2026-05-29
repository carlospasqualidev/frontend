import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// O jsdom não implementa ResizeObserver, usado por componentes Radix (ex.: ScrollArea).
// Polyfill no-op é suficiente para os testes — eles não medem layout.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Limpa o DOM renderizado após cada teste.
afterEach(() => {
  cleanup();
});
