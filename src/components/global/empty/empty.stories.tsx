import { Inbox, Search, Users } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Empty } from './empty';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/global/card/card';

const meta = {
  title: 'Globais/Empty',
  component: Empty,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Estado vazio padronizado. Props `title` e `description` obrigatórias; `icon` e `children` opcionais para CTA.',
      },
    },
  },
  args: { title: '', description: '' },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Mínimo" description="Apenas título e descrição.">
        <Empty
          title="Nenhum resultado encontrado"
          description="Ajuste os filtros e tente uma nova busca."
        />
      </Card>

      <Card
        title="Com ícone"
        description="Ícone dentro de EmptyMedia (variant icon)."
      >
        <Empty
          title="Caixa de entrada vazia"
          description="Mensagens novas aparecem aqui assim que chegarem."
          icon={<Inbox />}
        />
      </Card>

      <Card title="Com ação" description="Ícone + texto + CTA primária.">
        <Empty
          title="Nenhum usuário cadastrado"
          description="Cadastre o primeiro usuário da equipe para começar."
          icon={<Users />}
        >
          <Button>Cadastrar usuário</Button>
        </Empty>
      </Card>

      <Card
        title="Busca sem resultado"
        description="Padrão em listas filtradas."
      >
        <Empty
          title="Nenhum resultado para a busca"
          description="Tente termos diferentes ou remova os filtros aplicados."
          icon={<Search />}
        >
          <Button variant="outline">Limpar filtros</Button>
        </Empty>
      </Card>
    </div>
  ),
};
