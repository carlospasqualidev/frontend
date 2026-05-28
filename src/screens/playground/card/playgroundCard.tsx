import { Card } from '@/components/global/card/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export function PlaygroundCard() {
  return (
    <Card
      title="Card - Resumo da operação"
      description="Visão consolidada das movimentações do dia."
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Typography as="span" variant="muted">
            Entradas
          </Typography>
          <Typography as="span" variant="small">
            R$ 12.480,00
          </Typography>
        </div>

        <div className="flex items-center justify-between">
          <Typography as="span" variant="muted">
            Saídas
          </Typography>
          <Typography as="span" variant="small">
            R$ 8.920,00
          </Typography>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 pt-3">
          <Typography as="span" variant="small">
            Saldo
          </Typography>
          <Typography as="span" variant="small" className="font-semibold">
            R$ 3.560,00
          </Typography>
        </div>

        <Button className="w-full">Ver detalhes</Button>
      </div>
    </Card>
  );
}
