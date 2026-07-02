import { type ComponentProps } from 'react';

import { type Badge } from '@/components/ui/badge';
import { type UserRole, type UserStatus } from '@/screens/users/utils/types';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

export const roleBadgeVariants = new Map<UserRole, BadgeVariant>([
  ['admin', 'default'],
  ['manager', 'secondary'],
  ['member', 'outline'],
  ['viewer', 'ghost'],
]);

export const statusBadgeVariants = new Map<UserStatus, BadgeVariant>([
  ['active', 'default'],
  ['inactive', 'secondary'],
  ['pending', 'outline'],
  ['blocked', 'destructive'],
]);
