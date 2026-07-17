import { createRoute, lazyRouteComponent } from '@tanstack/react-router';

import { validateDataTableSearch } from '@/components/global/dataTable/dataTableSearch';
import { protectedLayoutRoute } from '@/routes';

/** Trilha de auditoria — `/audit-logs`. Tela única (detalhe em modal). */
export const auditLogsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/audit-logs',
  staticData: { breadcrumb: 'Auditoria' },
  validateSearch: validateDataTableSearch,
  component: lazyRouteComponent(() => import('./list'), 'AuditLogsPage'),
});
