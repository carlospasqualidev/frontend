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
  component: PlaygroundFormPage,
});

export const playgroundNavigationRoute = createRoute({
  getParentRoute: () => playgroundRoute,
  path: '/navigation',
  component: PlaygroundNavigationPage,
});

export const playgroundNavigationDetailsRoute = createRoute({
  getParentRoute: () => playgroundNavigationRoute,
  path: '/details',
  component: PlaygroundNavigationDetailsPage,
});

export const playgroundNavigationHistoryRoute = createRoute({
  getParentRoute: () => playgroundNavigationDetailsRoute,
  path: '/history',
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
