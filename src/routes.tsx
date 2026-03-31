import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';

import { NotFoundRedirect } from './components/global/layout/notFound';
import { playgroundRouteTree } from './screens/playground/routes';

import { Layout } from '@/components/global/layout/layout';
import { SessionValidation } from '@/components/global/layout/sessionValidation';
import { homeRoute } from '@/screens/home/routes';
import { loginRoute, signupRoute } from '@/screens/session/routes';

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundRedirect,
});

export const protectedLayoutRoute = createRoute({
  id: 'protected-layout',
  getParentRoute: () => rootRoute,
  component: () => (
    <SessionValidation>
      <Layout>
        <Outlet />
      </Layout>
    </SessionValidation>
  ),
});

export const router = createRouter({
  notFoundMode: 'root',
  routeTree: rootRoute.addChildren([
    loginRoute,
    signupRoute,
    protectedLayoutRoute.addChildren([homeRoute, playgroundRouteTree]),
  ]),
});
