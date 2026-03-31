import { AlertTriangle, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

export function ErrorFallback() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-muted/40 px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-primary),transparent_45%)]/8" />

      <div className="relative w-full max-w-xl rounded-3xl border border-border/60 bg-background/95 p-8 shadow-lg shadow-foreground/5 backdrop-blur sm:p-10">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" />
          </div>

          <div className="space-y-3">
            <Typography
              as="span"
              variant="small"
              className="text-muted-foreground"
            >
              Erro inesperado
            </Typography>

            <Typography as="h1" variant="h3" align="center">
              Oops! Encontramos um problema e nossa equipe foi notificada.
            </Typography>

            <Typography variant="muted" align="center">
              Atualize a página para tentar restabelecer a sessão e continuar de
              onde você parou.
            </Typography>
          </div>

          <Separator className="max-w-24" />

          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              window.location.replace(window.location.pathname);
            }}
          >
            <RefreshCcw className="size-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
}
