import { createRoute, lazyRouteComponent } from '@tanstack/react-router';

import { validateDataTableSearch } from '@/components/global/dataTable/dataTableSearch';
import { protectedLayoutRoute } from '@/routes';
import { UsersLayout } from '@/screens/users/usersLayout';

/**
 * Layout pai de tudo que vive sob `/users`. Só serve para que o breadcrumb
 * inclua "Usuários" como ancestral natural das telas filhas (lista, detalhe).
 */
export const usersLayoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/users',
  staticData: {
    breadcrumb: 'Usuários',
  },
  component: UsersLayout,
});

/**
 * Lista de usuários — casa em `/users`. Sem `breadcrumb` próprio: o pai
 * (`usersLayoutRoute`) já fornece "Usuários", evitando duplicação.
 */
export const usersListRoute = createRoute({
  getParentRoute: () => usersLayoutRoute,
  path: '/',
  validateSearch: validateDataTableSearch,
  component: lazyRouteComponent(() => import('./list'), 'UsersPage'),
});

interface UserDetailsSearch {
  tab?: string;
}

function validateUserDetailsSearch(
  search: Record<string, unknown>
): UserDetailsSearch {
  return {
    tab: typeof search.tab === 'string' ? search.tab : undefined,
  };
}

export const userDetailsRoute = createRoute({
  getParentRoute: () => usersLayoutRoute,
  path: '$userId',
  staticData: {
    breadcrumb: 'Detalhes do usuário',
  },
  validateSearch: validateUserDetailsSearch,
  component: lazyRouteComponent(() => import('./details'), 'UserDetailsPage'),
});
