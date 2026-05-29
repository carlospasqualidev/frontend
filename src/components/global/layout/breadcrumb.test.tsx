import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from './breadcrumb';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    breadcrumb?: string;
  }
}

function makeRouter(initialPath: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Breadcrumb />
        <Outlet />
      </>
    ),
  });

  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    staticData: { breadcrumb: 'Início' },
    component: () => <span>home</span>,
  });

  const usersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/users',
    staticData: { breadcrumb: 'Usuários' },
    component: () => <Outlet />,
  });

  const usersIndex = createRoute({
    getParentRoute: () => usersRoute,
    path: '/',
    component: () => <span>users</span>,
  });

  const detailsRoute = createRoute({
    getParentRoute: () => usersRoute,
    path: '/details',
    staticData: { breadcrumb: 'Detalhes' },
    component: () => <span>details</span>,
  });

  return createRouter({
    routeTree: rootRoute.addChildren([
      homeRoute,
      usersRoute.addChildren([usersIndex, detailsRoute]),
    ]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

describe('Breadcrumb', () => {
  it('não renderiza nada na raiz (único item seria o Início)', () => {
    const router = makeRouter('/');
    const { container } = render(<RouterProvider router={router} />);

    expect(container.querySelector('nav[aria-label="breadcrumb"]')).toBeNull();
  });

  it('renderiza apenas o título da rota atual em uma rota de 1 nível', async () => {
    const router = makeRouter('/users');
    render(<RouterProvider router={router} />);

    const current = await screen.findByText('Usuários');
    expect(current).toBeInTheDocument();
    // Item atual é marcado como página atual (aria-current="page"), não link real.
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('encadeia rotas com staticData.breadcrumb em sequência', async () => {
    const router = makeRouter('/users/details');
    render(<RouterProvider router={router} />);

    const usersLabel = await screen.findByText('Usuários');
    const detailsLabel = await screen.findByText('Detalhes');
    expect(usersLabel).toBeInTheDocument();
    expect(detailsLabel).toBeInTheDocument();
    // "Usuários" deixou de ser a rota atual e virou um link real para /users.
    expect(usersLabel.closest('a')).toHaveAttribute('href', '/users');
    // "Detalhes" é a rota atual e não envolve <a>.
    expect(detailsLabel.closest('a')).toBeNull();
    expect(detailsLabel).toHaveAttribute('aria-current', 'page');
  });
});
