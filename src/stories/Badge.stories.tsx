import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/global/card/card';

const meta = {
  title: 'UI primitivos/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Badge do shadcn — usado nas telas via `@/components/ui/badge`.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Variantes" description="Todas as variantes disponíveis.">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Card>

      <Card
        title="Com ícones"
        description="Lucide no início ou fim do conteúdo."
      >
        <div className="flex flex-wrap gap-2">
          <Badge>
            <CheckCircle2 />
            Concluído
          </Badge>
          <Badge variant="secondary">
            <Sparkles />
            Novo
          </Badge>
          <Badge variant="outline">
            Próximo passo
            <ArrowRight />
          </Badge>
        </div>
      </Card>

      <Card title="Status" description="Pílulas mapeadas para significado.">
        <div className="flex flex-wrap gap-2">
          <Badge>Ativo</Badge>
          <Badge variant="secondary">Pendente</Badge>
          <Badge variant="outline">Rascunho</Badge>
          <Badge variant="destructive">Cancelado</Badge>
        </div>
      </Card>
    </div>
  ),
};
