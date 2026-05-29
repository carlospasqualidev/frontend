import * as React from 'react';
import {
  Archive,
  Copy,
  MoreHorizontal,
  Pencil,
  Settings,
  Trash2,
  User,
} from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/global/card/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const meta = {
  title: 'UI primitivos/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Menu suspenso para ações de contexto, overflow e configurações. Suporta itens normais, destrutivos, separadores, grupos, checkboxes e radios.',
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckboxesDemo() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showCount, setShowCount] = React.useState(false);
  const [showOwner, setShowOwner] = React.useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Colunas visíveis</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mostrar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatus}
          onCheckedChange={setShowStatus}
        >
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showCount}
          onCheckedChange={setShowCount}
        >
          Total
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showOwner}
          onCheckedChange={setShowOwner}
        >
          Responsável
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RadioDemo() {
  const [sortBy, setSortBy] = React.useState('recent');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Ordenar por…</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ordenação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          <DropdownMenuRadioItem value="recent">
            Mais recentes
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">
            Mais antigos
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="alpha">
            Ordem alfabética
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="Ações de linha"
        description="Menu de '...' em itens de lista/tabela."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Mais ações">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive />
              Arquivar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>

      <Card
        title="Menu de usuário"
        description="Trigger com label, grupos e item destrutivo."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <User />
              Minha conta
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Conectado como Ana</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Configurações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>

      <Card
        title="Com checkboxes"
        description="Múltipla seleção, ex.: alternar visibilidade de colunas."
      >
        <CheckboxesDemo />
      </Card>

      <Card
        title="Com radio group"
        description="Seleção única, ex.: critério de ordenação."
      >
        <RadioDemo />
      </Card>
    </div>
  ),
};
