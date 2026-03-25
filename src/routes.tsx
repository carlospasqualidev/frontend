import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router';

import Layout from '@/components/global/layout';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { homeRoute } from '@/screens/home/routes';
import { loginRoute } from '@/screens/login/routes';

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/app' });
  },
});

export const protectedLayoutRoute = createRoute({
  path: '/app',
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
    indexRoute,
    loginRoute,
    protectedLayoutRoute.addChildren([homeRoute]),
  ]),
});
