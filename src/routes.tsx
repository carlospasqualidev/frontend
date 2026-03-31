import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';

import { formRouter } from './screens/playground/form/routes';

import { Layout } from '@/components/global/layout';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { homeRoute } from '@/screens/home/routes';
import { loginRoute, signupRoute } from '@/screens/session/routes';

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

export const protectedLayoutRoute = createRoute({
  id: 'protected-layout',
  getParentRoute: () => rootRoute,
  component: () => (
    <AuthProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AuthProvider>
  ),
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    loginRoute,
    signupRoute,
    protectedLayoutRoute.addChildren([homeRoute, formRouter]),
  ]),
});
