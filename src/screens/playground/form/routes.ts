import { createRoute } from '@tanstack/react-router';

import { FormPlaygroundCard } from './FormPlaygroundCard';

import { protectedLayoutRoute } from '@/routes';

export const formRouter = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/form-playground',
  component: FormPlaygroundCard,
});
