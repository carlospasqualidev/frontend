import { Info, Settings, Trash2 } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/global/card/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const meta = {
  title: 'UI primitivos/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dica de texto exibida ao passar o mouse / focar no trigger. Requer `TooltipProvider` em algum ancestral — no app real fica no `Layout`; aqui é embrulhado em cada story.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vitrine: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Em ícone-botão" description="Caso de uso mais comum.">
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Configurações">
                  <Settings />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Configurações</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Excluir"
                  className="text-destructive"
                >
                  <Trash2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir registro</TooltipContent>
            </Tooltip>
          </div>
        </Card>

        <Card
          title="Em texto auxiliar"
          description="Explicação contextual em rótulos de formulário."
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Taxa efetiva</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button aria-label="O que é taxa efetiva?">
                  <Info className="size-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Inclui juros, IOF e tarifas administrativas.
              </TooltipContent>
            </Tooltip>
          </div>
        </Card>

        <Card
          title="Posições"
          description="Use side para top/right/bottom/left."
        >
          <div className="flex flex-wrap items-center justify-center gap-8 py-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Top</Button>
              </TooltipTrigger>
              <TooltipContent side="top">Aparece em cima</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Right</Button>
              </TooltipTrigger>
              <TooltipContent side="right">À direita</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Embaixo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Left</Button>
              </TooltipTrigger>
              <TooltipContent side="left">À esquerda</TooltipContent>
            </Tooltip>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  ),
};
