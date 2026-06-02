import React from 'react';

import { SkeletonText, SkeletonValue } from '@/components/global/skeleton/skeleton';

export function UsersListSkeleton(): JSX.Element {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 bg-card rounded-md">
          <div className="flex items-center justify-between">
            <SkeletonText className="w-1/3 h-6" />
            <SkeletonValue className="w-24 h-5" />
          </div>
          <div className="mt-2">
            <SkeletonText className="w-2/3 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersListSkeleton;
