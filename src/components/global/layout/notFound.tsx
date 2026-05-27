import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="space-y-2">
        <Typography as="span" variant="small" className="text-muted-foreground">
          Erro 404
        </Typography>
        <Typography as="h1" variant="h2">
          Página não encontrada
        </Typography>
        <Typography variant="muted">
          A página que você procura não existe ou foi movida.
        </Typography>
      </div>

      <Button asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </div>
  );
}
