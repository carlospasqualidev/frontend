import type { router } from 'src/routes';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
