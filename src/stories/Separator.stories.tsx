import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Card } from '@/components/global/card/card';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'UI primitivos/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Linha divisória entre blocos de conteúdo. Aceita `orientation="horizontal"` (padrão) ou `"vertical"`. Por padrão é decorativa (`decorative=true`); marque como semântica passando `decorative={false}` quando dividir seções com significado.',
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Horizontal" description="Divide blocos empilhados.">
        <div className="space-y-3">
          <Typography variant="small">Documentação</Typography>
          <Typography variant="muted">
            Guias, referências e exemplos.
          </Typography>
          <Separator />
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>Blog</span>
            <Separator orientation="vertical" />
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>Suporte</span>
          </div>
        </div>
      </Card>

      <Card
        title="Vertical"
        description="Divide itens em linha — combine com flex."
      >
        <div className="flex h-12 items-center gap-4">
          <Typography variant="small">Ana Silva</Typography>
          <Separator orientation="vertical" />
          <Typography variant="muted">Administradora</Typography>
          <Separator orientation="vertical" />
          <Typography variant="muted">ana@empresa.com</Typography>
        </div>
      </Card>
    </div>
  ),
};
