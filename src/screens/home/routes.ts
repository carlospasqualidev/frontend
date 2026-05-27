import { createRoute, lazyRouteComponent } from '@tanstack/react-router';

import { protectedLayoutRoute } from '@/routes';

export const homeRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/',
  staticData: {
    breadcrumb: 'Início',
  },
  component: lazyRouteComponent(() => import('.'), 'DashboardPage'),
});
