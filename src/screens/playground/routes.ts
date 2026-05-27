import {
  createRoute,
  lazyRouteComponent,
  Outlet,
} from '@tanstack/react-router';

import { protectedLayoutRoute } from '@/routes';

export const playgroundRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/playground',
  staticData: {
    breadcrumb: 'Playground',
  },
  component: Outlet,
});

export const playgroundIndexRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/',
  component: lazyRouteComponent(() => import('.'), 'PlaygroundPage'),
});

export const playgroundFormRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/form',
  staticData: {
    breadcrumb: 'Playground de Formulários',
  },
  component: lazyRouteComponent(() => import('./form'), 'PlaygroundFormPage'),
});

export const playgroundNavigationRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/navigation',
  staticData: {
    breadcrumb: 'Testes de Navegação',
  },
  component: lazyRouteComponent(
    () => import('./navigation'),
    'PlaygroundNavigationPage'
  ),
});

export const playgroundNavigationDetailsRoute = createRoute({
  getParentRoute: () => playgroundNavigationRoute,
  path: '/details',
  staticData: {
    breadcrumb: 'Detalhes',
  },
  component: lazyRouteComponent(
    () => import('./navigation/details'),
    'PlaygroundNavigationDetailsPage'
  ),
});

export const playgroundNavigationHistoryRoute = createRoute({
  getParentRoute: () => playgroundNavigationDetailsRoute,
  path: '/history',
  staticData: {
    breadcrumb: 'Histórico',
  },
  component: lazyRouteComponent(
    () => import('./navigation/history'),
    'PlaygroundNavigationHistoryPage'
  ),
});

export const playgroundRouteTree = playgroundRoute.addChildren([
  playgroundIndexRoute,
  playgroundFormRoute,
  playgroundNavigationRoute.addChildren([
    playgroundNavigationDetailsRoute.addChildren([
      playgroundNavigationHistoryRoute,
    ]),
  ]),
]);
