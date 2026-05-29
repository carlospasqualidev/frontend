import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Card } from './card';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'Globais/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Container de conteúdo com `title` + `description` + `children`. Já trata `bg-card`, borda, `shadow-sm` (light) e `dark:shadow-none`.',
      },
    },
  },
  args: { title: '', description: '', children: null },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="Simples"
        description="Container básico com título, descrição e conteúdo livre."
      >
        <Typography variant="muted">
          Conteúdo do card. Use para qualquer agrupamento visual com cabeçalho
          e corpo.
        </Typography>
      </Card>

      <Card
        title="Resumo da operação"
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

      <Card
        title="Termos de uso"
        description="Leia atentamente antes de prosseguir."
      >
        <Typography variant="muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          aliquam tortor at quam pretium, ac convallis turpis dignissim. Nulla
          facilisi. Suspendisse potenti.
        </Typography>
      </Card>
    </div>
  ),
};
