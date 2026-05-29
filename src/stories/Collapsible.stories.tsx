import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/global/card/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'UI primitivos/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bloco expansível/colapsável. Útil para esconder seções secundárias (filtros avançados, detalhes adicionais, FAQ).',
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

function FaqItemDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between px-0">
          <span>Como redefinir minha senha?</span>
          <ChevronDown
            className={`size-4 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Typography variant="muted">
          Acesse "Minha conta" → "Segurança" e clique em "Alterar senha". Você
          receberá um link de redefinição no e-mail cadastrado.
        </Typography>
      </CollapsibleContent>
    </Collapsible>
  );
}

function AdvancedFiltersDemo() {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Filtros avançados
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">
        <div className="space-y-2 rounded-md border border-dashed border-border/70 p-3">
          <Typography variant="small">Período de criação</Typography>
          <Typography variant="muted">
            Aqui entrariam mais campos avançados — exibidos apenas quando o
            usuário expande.
          </Typography>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="FAQ item"
        description="Padrão de pergunta/resposta com chevron animado."
      >
        <FaqItemDemo />
      </Card>

      <Card
        title="Filtros avançados"
        description="Esconde campos opcionais até o usuário pedir."
      >
        <AdvancedFiltersDemo />
      </Card>
    </div>
  ),
};
