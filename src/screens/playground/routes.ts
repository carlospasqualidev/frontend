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

export const playgroundCardRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/card',
  staticData: {
    breadcrumb: 'Card',
  },
  component: lazyRouteComponent(() => import('./card'), 'PlaygroundCardPage'),
});

export const playgroundBadgeRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/badge',
  staticData: {
    breadcrumb: 'Badge',
  },
  component: lazyRouteComponent(() => import('./badge'), 'PlaygroundBadgePage'),
});

export const playgroundEmptyRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/empty',
  staticData: {
    breadcrumb: 'Empty',
  },
  component: lazyRouteComponent(() => import('./empty'), 'PlaygroundEmptyPage'),
});

export const playgroundSkeletonRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/skeleton',
  staticData: {
    breadcrumb: 'Skeleton',
  },
  component: lazyRouteComponent(
    () => import('./skeleton'),
    'PlaygroundSkeletonPage'
  ),
});

export const playgroundModalRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/modal',
  staticData: {
    breadcrumb: 'Modal',
  },
  component: lazyRouteComponent(() => import('./modal'), 'PlaygroundModalPage'),
});

export const playgroundButtonRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/button',
  staticData: {
    breadcrumb: 'Button',
  },
  component: lazyRouteComponent(
    () => import('./button'),
    'PlaygroundButtonPage'
  ),
});

export const playgroundConfirmDialogRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/confirm-dialog',
  staticData: {
    breadcrumb: 'ConfirmDialog',
  },
  component: lazyRouteComponent(
    () => import('./confirmDialog'),
    'PlaygroundConfirmDialogPage'
  ),
});

export const playgroundCrudRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/crud',
  staticData: {
    breadcrumb: 'CRUD end-to-end',
  },
  component: lazyRouteComponent(() => import('./crud'), 'PlaygroundCrudPage'),
});

export const playgroundOptimisticUpdateRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/optimistic-update',
  staticData: {
    breadcrumb: 'Optimistic update',
  },
  component: lazyRouteComponent(
    () => import('./optimisticUpdate'),
    'PlaygroundOptimisticUpdatePage'
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
  playgroundCardRoute,
  playgroundBadgeRoute,
  playgroundEmptyRoute,
  playgroundSkeletonRoute,
  playgroundModalRoute,
  playgroundButtonRoute,
  playgroundConfirmDialogRoute,
  playgroundCrudRoute,
  playgroundOptimisticUpdateRoute,
  playgroundNavigationRoute.addChildren([
    playgroundNavigationDetailsRoute.addChildren([
      playgroundNavigationHistoryRoute,
    ]),
  ]),
]);
