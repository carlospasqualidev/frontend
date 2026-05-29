import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'UI primitivos/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tipografia oficial do sistema. Use as variantes em vez de classes Tailwind soltas — garante consistência visual entre telas. A prop `as` desacopla o elemento HTML semântico do styling visual.',
      },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Variantes" description="Todos os pesos disponíveis.">
        <div className="space-y-4">
          <Typography variant="hero">Hero — manchete principal</Typography>
          <Typography variant="h1">H1 — título de página</Typography>
          <Typography variant="h2">H2 — título de seção</Typography>
          <Typography variant="h3">H3 — subtítulo</Typography>
          <Typography variant="lead">
            Lead — texto de abertura, parágrafo introdutório com peso visual.
          </Typography>
          <Typography variant="p">
            Parágrafo padrão. Texto corrido com leading otimizado para leitura.
          </Typography>
          <Typography variant="small">
            Small — texto auxiliar em negrito.
          </Typography>
          <Typography variant="muted">
            Muted — informação secundária, descrições, dicas.
          </Typography>
        </div>
      </Card>

      <Card
        title="Semântica × estilo"
        description="A prop as desacopla o elemento HTML do peso visual."
      >
        <div className="space-y-4">
          <Typography as="h1" variant="h3">
            H1 semântico com peso visual de H3
          </Typography>
          <Typography variant="muted">
            Útil quando o documento precisa de hierarquia correta mas o design
            pede um peso visual menor.
          </Typography>
        </div>
      </Card>
    </div>
  ),
};
