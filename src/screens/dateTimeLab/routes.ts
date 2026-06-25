import { createRoute, lazyRouteComponent } from '@tanstack/react-router';

import { rootRoute } from '@/routes';

// Rota pública — fica direto sob a rootRoute (fora do protectedLayoutRoute),
// então não exige sessão nem renderiza o shell autenticado (sidebar/breadcrumb).
export const dateTimeLabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/datetime-lab',
  staticData: {
    breadcrumb: 'Laboratório de datas',
  },
  component: lazyRouteComponent(() => import('.'), 'DateTimeLabPage'),
});
