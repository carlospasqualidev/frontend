import { createRoute, lazyRouteComponent } from '@tanstack/react-router';

import { rootRoute } from '@/routes';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  staticData: {
    breadcrumb: 'Login',
  },
  component: lazyRouteComponent(
    () => import('@/screens/session/login'),
    'LoginScreen'
  ),
});

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  staticData: {
    breadcrumb: 'Criar conta',
  },
  component: lazyRouteComponent(
    () => import('@/screens/session/signup'),
    'SignupScreen'
  ),
});
