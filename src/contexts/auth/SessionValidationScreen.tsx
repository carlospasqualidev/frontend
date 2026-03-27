import { useEffect, useState } from 'react';
import { CheckIcon, LoaderCircleIcon, ShieldCheckIcon } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const loadingMessages = [
  'Conectando com o servidor...',
  'Validando sua sessão...',
  'Carregando seu ambiente...',
  'Quase tudo pronto...',
];

const loadingSteps = [
  'Conexão segura estabelecida',
  'Sessão identificada',
  'Permissões verificadas',
];

function StepStatus({ isDone }: { isDone: boolean }) {
  if (isDone) {
    return <CheckIcon className="size-4" />;
  }

  return <LoaderCircleIcon className="size-4 animate-spin" />;
}

function getMessage(progress: number) {
  if (progress < 28) return loadingMessages[0];
  if (progress < 56) return loadingMessages[1];
  if (progress < 82) return loadingMessages[2];

  return loadingMessages[3];
}

export function SessionValidationScreen() {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current;
        }

        if (current < 40) {
          return current + 7;
        }

        if (current < 68) {
          return current + 4;
        }

        return current + 2;
      });
    }, 180);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.14),transparent_42%),linear-gradient(to_bottom,hsl(var(--muted)/0.45),transparent)]" />

      <section className="relative w-full max-w-xl overflow-hidden rounded-[28px] border bg-card/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheckIcon className="size-7" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">
              Segurança da sessão
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Validando seu acesso
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Aguarde um instante enquanto preparamos sua experiência com
              segurança.
            </p>
          </div>
        </div>

        <div className="space-y-3" aria-live="polite">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{getMessage(progress)}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>

          <Progress className="h-2.5" value={progress} />
        </div>

        <div className="mt-8 grid gap-3">
          {loadingSteps.map((step, index) => {
            const isDone = progress >= (index + 1) * 25;

            return (
              <div
                key={step}
                className={cn(
                  'flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors',
                  isDone ? 'border-primary/20 bg-primary/5' : 'bg-background/70'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full',
                      isDone
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <StepStatus isDone={isDone} />
                  </div>
                  <span className="text-sm font-medium">{step}</span>
                </div>

                <span className="text-xs text-muted-foreground">
                  {isDone ? 'concluído' : 'verificando'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
