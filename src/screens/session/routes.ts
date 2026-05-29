import {
  createRoute,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router';

import { rootRoute } from '@/routes';
import { sessionUserRef } from '@/services/api/sessionUserRef';

// Usuário já autenticado não deve ver as telas de login/signup — manda direto
// para a home. A referência vem do `sessionUserRef` (mantida em sincronia pelo
// `useSessionStore`) e não exige uma chamada extra à API.
function redirectIfAuthenticated() {
  if (sessionUserRef.get()) {
    throw redirect({ to: '/' });
  }
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  staticData: {
    breadcrumb: 'Login',
  },
  beforeLoad: redirectIfAuthenticated,
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
  beforeLoad: redirectIfAuthenticated,
  component: lazyRouteComponent(
    () => import('@/screens/session/signup'),
    'SignupScreen'
  ),
});
