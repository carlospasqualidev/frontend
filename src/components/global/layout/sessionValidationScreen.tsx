import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';
import { sidebarData } from '@/lib/constants/sidebar';

function getNextProgress(current: number) {
  if (current >= 94) {
    return current;
  }

  if (current < 36) {
    return current + 8;
  }

  if (current < 68) {
    return current + 4;
  }

  return current + 2;
}

export function SessionValidationScreen() {
  const { logo, name } = sidebarData.header;
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((current) => getNextProgress(current));
    }, 180);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_28%)]/8" />

      <div className="relative flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-xs flex-col items-center gap-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary text-3xl font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            {logo}
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Progress
                className="h-1.5"
                value={progress}
                aria-label="Validando sessão"
              />

              <p className="text-xs text-muted-foreground">
                Preparando seu ambiente...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative pb-10 text-center">
        <p className="text-sm text-muted-foreground">por</p>
        <p className="text-xl font-semibold text-primary">{name}</p>
      </div>
    </div>
  );
}
