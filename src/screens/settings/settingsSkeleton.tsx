import type { JSX } from 'react';

import { Card } from '@/components/global/card/card';
import { SkeletonText } from '@/components/global/skeleton/skeleton';

function ConfigRowSkeleton(): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0">
      <div className="space-y-2">
        <SkeletonText className="h-4 w-48" />
        <SkeletonText className="h-3 w-64" />
      </div>
      <SkeletonText className="h-9 w-40" />
    </div>
  );
}

export function SettingsSkeleton(): JSX.Element {
  return (
    <div className="space-y-4">
      <Card title="Geral" description="Identidade e comportamento padrão da aplicação.">
        <div>
          <ConfigRowSkeleton />
          <ConfigRowSkeleton />
          <ConfigRowSkeleton />
        </div>
      </Card>
      <Card title="Segurança" description="Autenticação, sessão e política de acesso.">
        <div>
          <ConfigRowSkeleton />
          <ConfigRowSkeleton />
        </div>
      </Card>
    </div>
  );
}

export default SettingsSkeleton;
