import { createRoute } from '@tanstack/react-router';

import { DashboardPage } from '.';

import { rootRoute } from '@/routes';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: DashboardPage,
});
