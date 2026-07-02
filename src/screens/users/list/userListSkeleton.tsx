import type { JSX } from 'react';

import {
  SkeletonText,
  SkeletonValue,
} from '@/components/global/skeleton/skeleton';

export function UsersListSkeleton(): JSX.Element {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-md bg-card p-4">
          <div className="flex items-center justify-between">
            <SkeletonText className="h-6 w-1/3" />
            <SkeletonValue className="h-5 w-24" />
          </div>
          <div className="mt-2">
            <SkeletonText className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersListSkeleton;
