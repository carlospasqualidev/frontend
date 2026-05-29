import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/global/card/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

interface Invoice {
  id: string;
  reference: string;
  amount: string;
  status: 'paid' | 'pending';
}

const INVOICES: Invoice[] = [
  { id: 'inv-2026-05', reference: 'Maio 2026', amount: 'R$ 149,00', status: 'paid' },
  { id: 'inv-2026-04', reference: 'Abril 2026', amount: 'R$ 149,00', status: 'paid' },
  { id: 'inv-2026-03', reference: 'Março 2026', amount: 'R$ 149,00', status: 'paid' },
  { id: 'inv-2026-02', reference: 'Fevereiro 2026', amount: 'R$ 149,00', status: 'paid' },
];

export function BillingTab() {
  return (
    <div className="grid gap-4">
      <Card
        title="Plano"
        description="Seu plano atual e próxima cobrança."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Typography as="span" variant="small">
                Plano Pro
              </Typography>
              <Badge variant="default">Ativo</Badge>
            </div>
            <Typography variant="muted" className="text-xs">
              R$ 149,00/mês · próxima cobrança em 15 de junho de 2026.
            </Typography>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => toast('Abrir comparação de planos.')}
            >
              Trocar de plano
            </Button>
            <Button
              variant="ghost"
              onClick={() => toast('Cancelamento iniciado.')}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="Método de pagamento"
        description="Cartão usado para cobranças automáticas."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Typography as="span" variant="small">
              Visa terminando em 4242
            </Typography>
            <Typography variant="muted" className="text-xs">
              Expira em 08/2028.
            </Typography>
          </div>
          <Button
            variant="outline"
            onClick={() => toast('Abrir formulário de novo método de pagamento.')}
          >
            Atualizar
          </Button>
        </div>
      </Card>

      <Card
        title="Histórico"
        description="Faturas emitidas nos últimos meses."
      >
        <ul className="divide-y divide-border/60">
          {INVOICES.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 space-y-1">
                <Typography as="span" variant="small" className="block">
                  {invoice.reference}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  {invoice.amount} ·{' '}
                  {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                </Typography>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast(`Baixando fatura ${invoice.reference}.`)}
              >
                <Download />
                Baixar
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
