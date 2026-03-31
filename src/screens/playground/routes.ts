import { createRoute, Outlet } from '@tanstack/react-router';

import { PlaygroundFormPage } from './form';
import { PlaygroundNavigationPage } from './navigation';
import { PlaygroundNavigationDetailsPage } from './navigation/details';
import { PlaygroundNavigationHistoryPage } from './navigation/history';

import { PlaygroundPage } from '.';

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
  component: PlaygroundPage,
});

export const playgroundFormRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/form',
  staticData: {
    breadcrumb: 'Playground de Formulários',
  },
  component: PlaygroundFormPage,
});

export const playgroundNavigationRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/navigation',
  staticData: {
    breadcrumb: 'Testes de Navegação',
  },
  component: PlaygroundNavigationPage,
});

export const playgroundNavigationDetailsRoute = createRoute({
  getParentRoute: () => playgroundNavigationRoute,
  path: '/details',
  staticData: {
    breadcrumb: 'Detalhes',
  },
  component: PlaygroundNavigationDetailsPage,
});

export const playgroundNavigationHistoryRoute = createRoute({
  getParentRoute: () => playgroundNavigationDetailsRoute,
  path: '/history',
  staticData: {
    breadcrumb: 'Histórico',
  },
  component: PlaygroundNavigationHistoryPage,
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
