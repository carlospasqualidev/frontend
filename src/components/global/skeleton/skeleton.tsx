'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ISkeletonProps {
  className?: string;
}

export function SkeletonText({ className }: ISkeletonProps) {
  return <Skeleton className={cn('h-4 w-24', className)} />;
}

export function SkeletonValue({ className }: ISkeletonProps) {
  return <Skeleton className={cn('h-8 w-32', className)} />;
}

export function SkeletonBadge({ className }: ISkeletonProps) {
  return <Skeleton className={cn('h-5 w-16 rounded-2xl', className)} />;
}

export function SkeletonAvatar({ className }: ISkeletonProps) {
  return <Skeleton className={cn('size-10 rounded-full', className)} />;
}
