import {
  createRoute,
  lazyRouteComponent,
  Outlet,
} from '@tanstack/react-router';

import { validateDataTableSearch } from '@/components/global/dataTable/dataTableSearch';
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

export const playgroundDataTableRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/data-table',
  // Persiste página/ordenação/filtros na URL (URL filtrada compartilhável).
  validateSearch: validateDataTableSearch,
  staticData: {
    breadcrumb: 'Data Table',
  },
  component: lazyRouteComponent(
    () => import('./dataTable'),
    'PlaygroundDataTablePage'
  ),
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
  playgroundDataTableRoute,
  playgroundNavigationRoute.addChildren([
    playgroundNavigationDetailsRoute.addChildren([
      playgroundNavigationHistoryRoute,
    ]),
  ]),
]);
