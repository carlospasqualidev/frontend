import { type ComponentProps } from 'react';

import { type Badge } from '@/components/ui/badge';
import { type UserRole, type UserStatus } from '@/screens/users/types';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

export const ROLE_BADGE_VARIANT: Record<UserRole, BadgeVariant> = {
  admin: 'default',
  manager: 'secondary',
  member: 'outline',
  viewer: 'ghost',
};

export const STATUS_BADGE_VARIANT: Record<UserStatus, BadgeVariant> = {
  active: 'default',
  inactive: 'secondary',
  pending: 'outline',
  blocked: 'destructive',
};
