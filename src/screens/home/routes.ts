import { createRoute } from '@tanstack/react-router';

import { DashboardPage } from '.';

import { protectedLayoutRoute } from '@/routes';

export const homeRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/',
  staticData: {
    breadcrumb: 'Home',
  },
  component: DashboardPage,
});
