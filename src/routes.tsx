import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';

import { Sidebar } from '@/components/ui/sidebar';
import { homeRoute } from '@/screens/home/routes';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { loginRoute } from '@/screens/login/routes';

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const protectedLayout = createRoute({
  id: 'protected',
  getParentRoute: () => rootRoute,
  component: () => (
    <AuthProvider>
      <Sidebar />
      <Outlet />
    </AuthProvider>
  ),
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    loginRoute,
    protectedLayout.addChildren([
      homeRoute,
      // debtsRoute.addChildren([
      //   debtsIndex,
      //   createDebt,
      //   createDebtWithDebtor,
      //   updateDebt,
      //   debtTabs.addChildren([
      //     debtsSummary,
      //     debtsList,
      //     debtDetails,
      //     paymentsRoute.addChildren([
      //       paymentsIndex,
      //       paymentDetails,
      //       totalPayment,
      //       partialPayment,
      //     ]),
      //   ]),
      // ]),
    ]),
  ]),
});
