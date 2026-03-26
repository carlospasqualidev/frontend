import { createRoute } from '@tanstack/react-router';

import { LoginScreen } from '@/screens/session/login';
import { SignupScreen } from '@/screens/session/signup';
import { rootRoute } from '@/routes';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginScreen,
});

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupScreen,
});
