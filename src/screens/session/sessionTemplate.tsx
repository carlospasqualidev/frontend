import type { ReactNode } from 'react';

import { ToggleTheme } from '@/components/global/layout/toggleTheme';

export function SessionTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ToggleTheme />
      </div>

      <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
    </div>
  );
}
