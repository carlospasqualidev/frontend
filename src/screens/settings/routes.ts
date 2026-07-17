import { createRoute, lazyRouteComponent } from '@tanstack/react-router';

import { protectedLayoutRoute } from '@/routes';

/** Configurações do sistema — `/settings`. Tela única (sem sub-rotas). */
export const settingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/settings',
  staticData: { breadcrumb: 'Configurações' },
  component: lazyRouteComponent(() => import('.'), 'SettingsPage'),
});
