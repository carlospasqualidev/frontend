import { createRoute } from '@tanstack/react-router';

import { DashboardPage } from '.';

import { rootRoute } from '@/routes';

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: DashboardPage,
});
